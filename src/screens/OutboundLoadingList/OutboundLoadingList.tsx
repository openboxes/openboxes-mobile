import { DispatchProps, Props, State } from '../OutboundStockList/types';
import React from 'react';
import { View, FlatList, ListRenderItemInfo, Text } from 'react-native';
import { connect } from 'react-redux';
import { showScreenLoading, hideScreenLoading } from '../../redux/actions/main';
import { RootState } from '../../redux/reducers';
import styles from '../OutboundStockList/styles';
import { getShipmentsReadyToBePacked } from '../../redux/actions/packing';
import { Shipment } from '../../data/container/Shipment';
import showPopup from '../../components/Popup';
import EmptyView from '../../components/EmptyView';
import { Card } from 'react-native-paper';
import { LayoutStyle } from '../../assets/styles';
import BarcodeSearchHeader from '../../components/BarcodeSearchHeader/BarcodeSearchHeader';
import _ from 'lodash';
import { Container } from '../../data/container/Container';

// List of shipments ready for loading
class OutboundLoadingList extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      error: null,
      shipments: [],
      filteredShipments: []
    };
  }

  componentDidMount() {
    this.props.navigation.addListener('focus', () => {
      this.fetchShipmentsReadyForLoading();
    });
  }

  actionCallback = (data: any) => {
    const { currentLocation } = this.props;
    if (!data || data?.error) {
      showPopup({
        title: data.errorMessage ? 'Shipment details' : null,
        message: data.errorMessage ?? 'Failed to submit shipment details',
        positiveButton: {
          text: 'Retry',
          callback: () => {
            this.props.getShipmentsReadyToBePacked(currentLocation.id, 'PENDING', this.actionCallback);
          }
        },
        negativeButtonText: 'Cancel'
      });
    } else {
      if (data?.length > 0) {
        this.setState({
          shipments: data
        });
      }
    }
    this.props.hideScreenLoading();
  };

  fetchShipmentsReadyForLoading = () => {
    const { currentLocation } = this.props;
    this.props.showScreenLoading('Loading..');
    // TODO: For now were pull the same list of shipments as for packing list. Later change to the list of shipments
    // ready to be loaded
    this.props.getShipmentsReadyToBePacked(currentLocation.id, 'PENDING', this.actionCallback);
  };

  showShipmentLoadScreen = (shipment: any) => {
    this.props.navigation.navigate('OutboundLoadingDetails', {
      shipmentId: shipment.id
    });
  };

  filterShipments = (searchTerm: string) => {
    if (searchTerm) {
      // Find exact match by LPN
      const exactShipmentByLPN = _.find(this.state.shipments, (shipment: Shipment) => _.find(
        shipment?.availableContainers,
        (container: Container) => container.containerNumber === searchTerm
      ));

      if (exactShipmentByLPN) {
        this.resetFiltering();
        // TODO: make it redirect to LOAD LPN page instead of loading order details
        this.showShipmentLoadScreen(exactShipmentByLPN);
        return;
      }

      // If no exact match by LPN, then filter by <shipment number or loading location> containing the search term
      const filteredShipments = _.filter(this.state.shipments, (shipment: Shipment) => {
        const matchingShipmentNumber = shipment?.shipmentNumber?.toLowerCase()?.includes(searchTerm.toLowerCase());

        const matchingLoadingLocation =
          shipment?.loadingStatusDetails?.loadingLocation?.locationNumber?.toLowerCase()?.includes(searchTerm.toLowerCase()) ||
          shipment?.loadingStatusDetails?.loadingLocation?.name?.toLowerCase()?.includes(searchTerm.toLowerCase());

        return (matchingShipmentNumber || matchingLoadingLocation) as boolean;
      });

      // if only one match, then redirect to loading order details
      if (filteredShipments.length === 1) {
        this.resetFiltering();
        this.showShipmentLoadScreen(filteredShipments[0]);
        return;
      }

      this.setState({
        ...this.state,
        filteredShipments
      });

      return;
    }

    this.resetFiltering();
  };

  resetFiltering = () => {
    this.setState({
      ...this.state,
      filteredShipments: []
    });
  };

  render() {
    return (
      <View style={styles.screenContainer}>
        <BarcodeSearchHeader
          autoSearch
          placeholder={'Search or scan barcode'}
          resetSearch={this.resetFiltering}
          searchBox={false}
          onSearchTermSubmit={this.filterShipments}
        />
        <View style={styles.contentContainer}>
          <FlatList
            data={this.state.filteredShipments.length > 0 ? this.state.filteredShipments : this.state.shipments}
            ListEmptyComponent={
              <EmptyView title="Loading" description=" There are no items to load" isRefresh={false} />
            }
            renderItem={(shipment: ListRenderItemInfo<Shipment>) => (
              <Card
                style={LayoutStyle.listItemContainer}
                onPress={() => this.showShipmentLoadScreen(shipment.item)}
              >
                <Card.Content>
                  <View style={styles.row}>
                    <View style={styles.col50}>
                      <Text style={styles.label}>Shipment Number</Text>
                      <Text style={styles.value}>{shipment.item.shipmentNumber}</Text>
                    </View>
                    <View style={styles.col50}>
                      <Text style={styles.label}>Status</Text>
                      <Text style={styles.value}>{shipment.item.requisitionStatus}</Text>
                    </View>
                  </View>
                  <View style={styles.row}>
                    <View style={styles.col50}>
                      <Text style={styles.label}>Destination</Text>
                      <Text style={styles.value}>{shipment.item.destination.name}</Text>
                    </View>
                    <View style={styles.col50}>
                      <Text style={styles.label}>Expected Shipping Date</Text>
                      <Text style={styles.value}>{shipment.item.expectedShippingDate}</Text>
                    </View>
                  </View>
                  <View style={styles.row}>
                    <View style={styles.col50}>
                      <Text style={styles.label}>Loading Location</Text>
                      <Text style={styles.value}>{shipment.item.loadingLocation}</Text>
                    </View>
                    <View style={styles.col50}>
                      <Text style={styles.label}>Expected Delivery Date</Text>
                      <Text style={styles.value}>{shipment.item.expectedDeliveryDate}</Text>
                    </View>
                  </View>
                  <View style={styles.row}>
                    <View style={styles.col50}>
                      <Text style={styles.label}>Containers Loaded</Text>
                      <Text style={styles.value}>{shipment.item.loadingStatusDetails.statusMessage}</Text>
                    </View>
                  </View>
                </Card.Content>
              </Card>
            )}
            keyExtractor={(item) => item.id}
            style={styles.list}
          />
        </View>
      </View>
    );
  }
}

const mapStateToProps = (state: RootState) => ({
  currentLocation: state.mainReducer.currentLocation
});

const mapDispatchToProps: DispatchProps = {
  showScreenLoading,
  hideScreenLoading,
  getShipmentsReadyToBePacked
};

export default connect(mapStateToProps, mapDispatchToProps)(OutboundLoadingList);
