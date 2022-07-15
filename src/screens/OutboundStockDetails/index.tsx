import { DispatchProps, Props, State } from './types';
import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import { connect } from 'react-redux';
import { hideScreenLoading, showScreenLoading } from '../../redux/actions/main';
import { RootState } from '../../redux/reducers';
import styles from './styles';
import { getShipment } from '../../redux/actions/packing';
import OutboundVMMapper from './OutboubVmMapper';
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
      shipmentData: null,
      scannedValue: ''
    };
  }

  componentDidMount() {
    this.fetchShipment();
  }

  componentDidUpdate() {
    if (this.props.route.params.refetchShipment) {
      this.fetchShipment();
    }
  }

  fetchShipment = () => {
    const { shipmentId } = this.props.route.params;
    this.props.navigation.setParams({ refetchShipment: false });
    const actionCallback = (data: any) => {
      if (!data || data?.error) {
        return Promise.resolve(null);
      } else {
        this.setState({
          shipment: data,
          shipmentData: OutboundVMMapper(data)
        });
      }
      this.props.hideScreenLoading();
    };
    this.props.showScreenLoading('Loading..');
    this.props.getShipment(shipmentId, actionCallback);
  };

  onScan = (value: string) => {
    this.setState({ scannedValue: value }, () => {
      if (value) {
        const matchingLotNumberOrProduct = this.findMatchingLotNumberOrProduct(value);
        if (matchingLotNumberOrProduct) {
          this.setState({ scannedValue: '' }, () => {
            this.showOrderDetailsScreen(matchingLotNumberOrProduct);
          });
          return;
        }

        const matchingContainer = this.findMatchingContainer(value);
        if (matchingContainer) {
          this.setState({ scannedValue: '' }, () => {
            this.showLPNDetailsScreen(matchingContainer, this.state.shipment?.shipmentNumber);
          });
          return;
        }
      }
    });
  };

  onScanEnd = (value: string) => {
    if (value) {
      const matchingLotNumberOrProduct = this.findMatchingLotNumberOrProduct(value);
      if (matchingLotNumberOrProduct) {
        this.showOrderDetailsScreen(matchingLotNumberOrProduct);
        return;
      }
      const matchingContainer = this.findMatchingContainer(value);
      if (matchingContainer) {
        this.showLPNDetailsScreen(matchingContainer, this.state.shipment?.shipmentNumber);
        return;
      }
      showPopup({
        message: `Unable to locate a product, item, or container with identifier: ${value}`
      });
      this.setState({ scannedValue: '' });
    }
  };

  findMatchingLotNumberOrProduct = (input: string) => {
    const searchTerm = input.toLowerCase();
    return this.state.shipment?.shipmentItems?.find(
      (item: ShipmentItems) =>
        item.lotNumber?.toLowerCase().includes(searchTerm) ||
        item.inventoryItem?.product?.productCode?.toLowerCase()?.includes(searchTerm)
    );
  };

  findMatchingContainer = (input: string) => {
    const searchTerm = input.toLowerCase();
    return this.state.shipment?.availableContainers?.find(
      (container: Container) =>
        container.containerNumber?.toLowerCase()?.includes(searchTerm) ||
        container?.name?.toLowerCase().includes(searchTerm)
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
            onChange={this.onScan}
            onEndEdit={this.onScanEnd}
          />
          <ContainerDetails item={this.state.shipmentData?.sectionData ?? []} />
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
