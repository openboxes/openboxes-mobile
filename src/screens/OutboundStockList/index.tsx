import { DispatchProps, Props, State } from './types';
import React from 'react';
import {
  View,
  FlatList,
  ListRenderItemInfo,
  Text} from 'react-native';
import { connect } from 'react-redux';
import { showScreenLoading, hideScreenLoading } from '../../redux/actions/main';
import { RootState } from '../../redux/reducers';
import styles from './styles';
import { getShipmentsReadyToBePacked } from '../../redux/actions/packing';
import { Shipment } from '../../data/container/Shipment';
import showPopup from '../../components/Popup';
import EmptyView from '../../components/EmptyView';
import { Card } from 'react-native-paper';
import { LayoutStyle } from '../../assets/styles';
import BarcodeSearchHeader from '../../components/BarcodeSearchHeader/BarcodeSearchHeader';
import _ from "lodash";

class OutboundStockList extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      error: null,
      shipments: [],
      filteredShipments: []
    };
  }

  componentDidMount() {
    this.fetchPacking();
  }

  fetchPacking = () => {
    // eslint-disable-next-line complexity
    const actionCallback = (data: any) => {
      if (!data || data?.error) {
        showPopup({
          title: data.errorMessage ? 'Shipment details' : null,
          message: data.errorMessage ?? 'Failed to submit shipment details',
          positiveButton: {
            text: 'Retry',
            callback: () => {
              this.props.getShipmentsReadyToBePacked(
                currentLocation.id,
                'PENDING',
                actionCallback
              );
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
    const { currentLocation } = this.props;
    this.props.showScreenLoading('Loading..');
    this.props.getShipmentsReadyToBePacked(
      currentLocation.id,
      'PENDING',
      actionCallback
    );
  };

  showShipmentReadyToPackScreen = (shipment: Shipment) => {
    this.props.navigation.navigate('OutboundStockDetails', {
      shipmentId: shipment.id
    });
  };

  filterShipments = (searchTerm: string) => {
    if (searchTerm) {
      const exactOutboundOrder = _.find(
        this.state.shipments,
        (shipment: Shipment) => {
          const matchingShipmentNumber = shipment?.shipmentNumber?.toLowerCase() === searchTerm.toLowerCase();
          const matchingContainer = _.find(
            shipment?.availableContainers,
            container => container.containerNumber === searchTerm,
          );
          return matchingShipmentNumber || matchingContainer;
        }
      );

      if (exactOutboundOrder) {
        this.setState({
          ...this.state,
          filteredShipments: [],
        });
        this.showShipmentReadyToPackScreen(exactOutboundOrder);
      } else {
        const filteredShipments = _.filter(
          this.state.shipments,
          (shipment: Shipment) =>
            shipment?.shipmentNumber
              ?.toLowerCase()
              ?.includes(searchTerm.toLowerCase())
        );
        this.setState({
          ...this.state,
          filteredShipments
        });
      }

      return;
    }

    this.resetFiltering();
  };

  resetFiltering = () => {
    this.setState({
      ...this.state,
      filteredShipments: []
    });
}

  render() {
    return (
      <View style={styles.screenContainer}>
        <BarcodeSearchHeader
          placeholder={'Order or Container Number'}
          onSearchTermSubmit={this.filterShipments}
          resetSearch={this.resetFiltering}
          searchBox={false}
          autoSearch={false}

        />
        <View style={styles.contentContainer}>
          <FlatList
            data={this.state.filteredShipments.length > 0
              ? this.state.filteredShipments
              : this.state.shipments
            }
            ListEmptyComponent={
              <EmptyView
                title="Packing"
                description=" There are no items to pack"
                isRefresh={false}
              />
            }
            renderItem={(shipment: ListRenderItemInfo<Shipment>) => (
              <Card
                style={LayoutStyle.listItemContainer}
                onPress={() =>
                  this.showShipmentReadyToPackScreen(shipment.item)
                }
              >
                <Card.Content>
                  <View style={styles.row}>
                    <View style={styles.col50}>
                      <Text style={styles.label}>Shipment Number</Text>
                      <Text style={styles.value}>
                        {shipment.item.shipmentNumber}
                      </Text>
                    </View>
                    <View style={styles.col50}>
                      <Text style={styles.label}>Status</Text>
                      <Text style={styles.value}>{shipment.item.requisitionStatus}</Text>
                    </View>
                  </View>
                  <View style={styles.row}>
                    <View style={styles.col50}>
                      <Text style={styles.label}>Destination</Text>
                      <Text style={styles.value}>
                        {shipment.item.destination.name}
                      </Text>
                    </View>
                    <View style={styles.col50}>
                      <Text style={styles.label}>Expected Shipping Date</Text>
                      <Text style={styles.value}>
                        {shipment.item.expectedShippingDate}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.row}>
                    <View style={styles.col50}>
                      <Text style={styles.label}>Packing Location</Text>
                      <Text style={styles.value}>
                        {shipment.item.packingLocation}
                      </Text>
                    </View>
                    <View style={styles.col50}>
                      <Text style={styles.label}>Loading Location</Text>
                      <Text style={styles.value}>
                        {shipment.item.loadingLocation}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.row}>
                    <View style={styles.col50}>
                      <Text style={styles.label}>Number of containers</Text>
                      <Text style={styles.value}>
                        {shipment.item.availableContainers.length}
                      </Text>
                    </View>
                    <View style={styles.col50}>
                      <Text style={styles.label}>Items packed</Text>
                      <Text style={styles.value}>
                        {shipment.item.packingStatus}
                      </Text>
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
export default connect(mapStateToProps, mapDispatchToProps)(OutboundStockList);
