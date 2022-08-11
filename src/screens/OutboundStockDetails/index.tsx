import _ from 'lodash';
import { DispatchProps, Props, State, SectionData } from './types';
import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import { connect } from 'react-redux';
import { hideScreenLoading, showScreenLoading } from '../../redux/actions/main';
import { RootState } from '../../redux/reducers';
import styles from './styles';
import { getShipment } from '../../redux/actions/packing';
import ContainerDetails from './ContainerDetails';
import Button from '../../components/Button';
import InputBox from '../../components/InputBox';
import ShipmentItems from '../../data/inbound/ShipmentItems';
import { Container } from '../../data/container/Shipment';
import showPopup from '../../components/Popup';

// Shipment packing (Packing Order Details)
class OutboundStockDetails extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      error: null,
      shipment: null,
      scannedValue: '',
      matchingShipmentItemIds: [],
      matchingContainerIds: []
    };
    this.onScan = _.debounce(this.onScan, 500);
  }

  componentDidMount() {
    this.fetchShipment();
  }

  componentDidUpdate() {
    if (this.props.route.params.refetchShipment) {
      this.fetchShipment();
    }
  }

  get sectionData(): SectionData[] {
    let containers = this.state.shipment?.containers ?? [];
    if (containers.length === 0) {
      return [];
    }

    if (this.state.matchingContainerIds.length > 0) {
      containers = containers.filter(({ id: containerId }) => this.state.matchingContainerIds.includes(containerId));
    }

    return containers
      .map((container) => {
        let shipmentItems = container.shipmentItems ?? [];

        if (this.state.matchingShipmentItemIds.length > 0) {
          shipmentItems = shipmentItems.filter(({ id: shipmentItemId }) =>
            this.state.matchingShipmentItemIds.includes(shipmentItemId)
          );
        }

        return {
          title: container.name ?? 'Unpacked Items',
          id: container.id,
          data: shipmentItems
        };
      })
      .filter(({ data }) => data && data.length > 0);
  }

  fetchShipment = () => {
    const { shipmentId } = this.props.route.params;
    this.props.navigation.setParams({ refetchShipment: false });
    const actionCallback = (data: any) => {
      if (!data || data?.error) {
        return Promise.resolve(null);
      } else {
        this.setState({ shipment: data });
      }
      this.props.hideScreenLoading();
    };
    this.props.showScreenLoading('Loading..');
    this.props.getShipment(shipmentId, actionCallback);
  };

  onScanValueChange = (value: string) => {
    this.setState({ scannedValue: value });
    this.onScan(value);
  };

  onScan = (value: string) => {
    if (!value) {
      this.setState({ matchingShipmentItemIds: [], matchingContainerIds: [] });
      return;
    }

    const matchingLotNumberOrProduct = this.findMatchingShipmentItem(value);
    const matchingShipmentItemIds = matchingLotNumberOrProduct.map(({ id }) => id);
    if (matchingShipmentItemIds.length === 1) {
      this.setState({ scannedValue: '', matchingShipmentItemIds: [], matchingContainerIds: [] }, () => {
        this.showOrderDetailsScreen(matchingLotNumberOrProduct[0]);
      });
      return;
    } else if (matchingShipmentItemIds.length > 1) {
      this.setState({ matchingShipmentItemIds, matchingContainerIds: [] });
      return;
    } else if (this.state.matchingShipmentItemIds.length > 0) {
      this.setState({ matchingShipmentItemIds: [] });
    }

    const matchingContainer = this.findMatchingContainer(value);
    const matchingContainerIds = matchingContainer.map(({ id }) => id);
    if (matchingContainerIds.length === 1) {
      this.setState({ scannedValue: '', matchingShipmentItemIds: [], matchingContainerIds: [] }, () => {
        this.showLPNDetailsScreen(matchingContainer[0]);
      });
      return;
    } else if (matchingContainerIds.length > 1) {
      this.setState({ matchingContainerIds, matchingShipmentItemIds: [] });
      return;
    } else if (this.state.matchingContainerIds.length > 0) {
      this.setState({ matchingContainerIds: [] });
    }
    showPopup({
      message: `Unable to locate a product, item, or container with identifier: ${value}`
    });
  };

  findMatchingShipmentItem = (input: string): ShipmentItems[] => {
    const searchTerm = input.toLowerCase();
    return (
      this.state.shipment?.shipmentItems?.filter(
        (item: ShipmentItems) =>
          item.inventoryItem?.lotNumber?.toLowerCase().includes(searchTerm) ||
          item.lotNumber?.toLowerCase().includes(searchTerm) ||
          item.inventoryItem?.product?.productCode?.toLowerCase()?.includes(searchTerm)
      ) || []
    );
  };

  findMatchingContainer = (input: string): Container[] => {
    const searchTerm = input.toLowerCase();
    return (
      this.state.shipment?.availableContainers?.filter(
        (container: Container) =>
          container.containerNumber?.toLowerCase()?.includes(searchTerm) ||
          container?.name?.toLowerCase().includes(searchTerm)
      ) || []
    );
  };

  showOrderDetailsScreen = (item: any) => {
    this.props.navigation.navigate('ShipmentDetails', {
      item: item
    });
  };

  showLPNDetailsScreen = (container: Container, shipmentNumber: string | undefined) => {
    this.props.navigation.navigate('LpnDetail', {
      id: container?.id,
      shipmentNumber: shipmentNumber
    });
  };

  render() {
    return (
      <>
        <ScrollView style={styles.screenContainer}>
          <View style={styles.contentContainer}>
            <View style={styles.row}>
              <View style={styles.col50}>
                <Text style={styles.label}>Shipment Number</Text>
                <Text style={styles.value}>{this.state.shipment?.shipmentNumber}</Text>
              </View>
              <View style={styles.col50}>
                <Text style={styles.label}>Status</Text>
                <Text style={styles.value}>{this.state.shipment?.displayStatus}</Text>
              </View>
            </View>
            <View style={styles.row}>
              <View style={styles.col50}>
                <Text style={styles.label}>Destination</Text>
                <Text style={styles.value}>{this.state.shipment?.destination.name}</Text>
              </View>
              <View style={styles.col50}>
                <Text style={styles.label}>Expected Shipping Date</Text>
                <Text style={styles.value}>{this.state.shipment?.expectedShippingDate}</Text>
              </View>
            </View>
            <View style={styles.row}>
              <View style={styles.col50}>
                <Text style={styles.label}>Packing Location</Text>
                <Text style={styles.value}>
                  {this.state.shipment?.packingLocation ?? 'Unassigned'}
                </Text>
              </View>
              <View style={styles.col50}>
                <Text style={styles.label}>Items Packed</Text>
                <Text style={styles.value}>
                  {this.state.shipment?.packingStatusDetails?.statusMessage}
                </Text>
              </View>
            </View>
          </View>
          <InputBox
            style={styles.scanSearch}
            value={this.state.scannedValue}
            disabled={false}
            editable={false}
            label={'Search'}
            onChange={this.onScanValueChange}
          />
          <ContainerDetails item={this.sectionData} />
        </ScrollView>
        <View style={styles.buttonBar}>
          <Button
            title={'Create LPN'}
            disabled={false}
            onPress={() => {
              this.props.navigation.navigate('CreateLpn', {
                id: this?.state?.shipment?.id,
                shipmentDetail: this?.state?.shipment
              });
            }}
          />
        </View>
      </>
    );
  }
}

const mapStateToProps = (state: RootState) => ({
  currentLocation: state.mainReducer.currentLocation
});

const mapDispatchToProps: DispatchProps = {
  showScreenLoading,
  hideScreenLoading,
  getShipment
};
export default connect(mapStateToProps, mapDispatchToProps)(OutboundStockDetails);
