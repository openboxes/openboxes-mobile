import { DispatchProps, Props, State } from '../OutboundStockList/types';
import React from 'react';
import { View, FlatList, ListRenderItemInfo } from 'react-native';
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
import BarcodeSearchHeader from '../../components/BarcodeSearchHeader';
import _ from 'lodash';
import { Container } from '../../data/container/Container';
import { Props as LabeledDataType } from '../../components/LabeledData/types';
import DetailsTable from '../../components/DetailsTable';

// List of shipments ready for loading
class OutboundLoadingList extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      error: null,
      shipments: [],
      filteredShipments: []
    };
    this.renderDataItem = this.renderDataItem.bind(this);
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
    // For now were pull the same list of shipments as for packing list. Later change to the list of shipments
    // ready to be loaded
    this.props.getShipmentsReadyToBePacked(currentLocation.id, 'PENDING', this.actionCallback);
  };

  showLoadingDetailsScreen = (shipment: any) => {
    this.props.navigation.navigate('OutboundLoadingDetails', {
      shipmentId: shipment.id
    });
  };

  showLoadingLPNScreen = (shipment: Shipment, container: Container) => {
    this.props.navigation.navigate('OutboundLoadingContainer', {
      shipment: shipment,
      container: container,
      scanned: true
    });
  };

  filterShipments = (searchTerm: string) => {
    if (searchTerm) {
      // Find exact match by LPN
      const exactShipmentByLPN = _.find(this.state.shipments, (shipment: Shipment) =>
        _.find(shipment?.availableContainers, (container: Container) => container.containerNumber === searchTerm)
      );

      if (exactShipmentByLPN) {
        const exactContainer = _.find(
          exactShipmentByLPN?.availableContainers,
          (container: Container) => container.containerNumber === searchTerm
        );

        this.resetFiltering();
        this.showLoadingLPNScreen(exactShipmentByLPN, exactContainer);
        return;
      }

      // If no exact match by LPN, then filter by <shipment number or loading location> containing the search term
      const filteredShipments = _.filter(this.state.shipments, (shipment: Shipment) => {
        const matchingShipmentNumber = shipment?.shipmentNumber?.toLowerCase()?.includes(searchTerm.toLowerCase());

        const matchingLoadingLocation =
          shipment?.loadingStatusDetails?.loadingLocation?.locationNumber
            ?.toLowerCase()
            ?.includes(searchTerm.toLowerCase()) ||
          shipment?.loadingStatusDetails?.loadingLocation?.name?.toLowerCase()?.includes(searchTerm.toLowerCase());

        return matchingShipmentNumber || matchingLoadingLocation;
      });

      // if only one match, then redirect to loading order details
      if (filteredShipments.length === 1) {
        this.resetFiltering();
        this.showLoadingDetailsScreen(filteredShipments[0]);
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

  renderDataItem(shipment: ListRenderItemInfo<Shipment>) {
    const renderData: LabeledDataType[] = [
      { label: 'Shipment Number', value: shipment.item.shipmentNumber },
      {
        label: 'Status',
        value: `${shipment.item.displayStatus} (${shipment.item.loadingStatusDetails.statusMessage} containers)`
      },
      { label: 'Destination', value: shipment.item.destination.name },
      { label: 'Expected Shipping Date', value: shipment.item.expectedShippingDate },
      { label: 'Loading Location', value: shipment.item.loadingLocation },
      { label: 'Expected Delivery Date', value: shipment.item.expectedDeliveryDate }
    ];

    return (
      <Card style={LayoutStyle.listItemContainer} onPress={() => this.showLoadingDetailsScreen(shipment.item)}>
        <Card.Content>
          <DetailsTable data={renderData} />
        </Card.Content>
      </Card>
    );
  }

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
            renderItem={this.renderDataItem}
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
