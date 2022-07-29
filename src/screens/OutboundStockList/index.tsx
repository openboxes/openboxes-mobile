import { DispatchProps, Props, State } from './types';
import React from 'react';
import { View, FlatList, ListRenderItemInfo } from 'react-native';
import { connect } from 'react-redux';
import { showScreenLoading, hideScreenLoading } from '../../redux/actions/main';
import { RootState } from '../../redux/reducers';
import { common } from '../../assets/styles';
import { getShipmentsReadyToBePacked } from '../../redux/actions/packing';
import { Shipment } from '../../data/container/Shipment';
import showPopup from '../../components/Popup';
import EmptyView from '../../components/EmptyView';
import { Card } from 'react-native-paper';
import BarcodeSearchHeader from '../../components/BarcodeSearchHeader';
import _ from 'lodash';
import ShipmentItems from '../../data/inbound/ShipmentItems';
import { Container } from '../../data/container/Container';
import { Props as LabeledDataType } from '../../components/LabeledData/types';
import DetailsTable from '../../components/DetailsTable';

// List of shipments ready for packing
class OutboundStockList extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      error: null,
      shipments: [],
      filteredShipments: []
    };
    this.renderPackingList = this.renderPackingList.bind(this);
  }

  componentDidMount() {
    this.props.navigation.addListener('focus', () => {
      this.fetchPacking();
    });
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
              this.props.getShipmentsReadyToBePacked(currentLocation.id, 'PENDING', actionCallback);
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
    this.props.getShipmentsReadyToBePacked(currentLocation.id, 'PENDING', actionCallback);
  };

  showShipmentReadyToPackScreen = (shipment: any) => {
    this.props.navigation.navigate('OutboundStockDetails', {
      shipmentId: shipment.id
    });
  };

  filterShipments = (searchTerm: string) => {
    if (searchTerm) {
      // Find exact match by shipment number or container number (if found, then redirect to the packing screen)
      const exactOutboundOrder = _.find(this.state.shipments, (shipment: Shipment) => {
        const matchingShipmentNumber = shipment?.shipmentNumber?.toLowerCase() === searchTerm.toLowerCase();
        const matchingContainer = _.find(
          shipment?.availableContainers,
          (container) => container.containerNumber === searchTerm
        );
        const matchingPackingLocation =
          shipment?.packingStatusDetails?.packingLocation?.locationNumber?.toLowerCase() === searchTerm.toLowerCase() ||
          shipment?.packingStatusDetails?.packingLocation?.name?.toLowerCase() === searchTerm.toLowerCase();
        return matchingShipmentNumber || matchingContainer || matchingPackingLocation;
      });

      if (exactOutboundOrder) {
        this.resetFiltering();
        this.showShipmentReadyToPackScreen(exactOutboundOrder);
      } else {
        // If no exact match, then filter by <shipment number, container number, lot number on item> containing the search term
        const filteredShipments = _.filter(this.state.shipments, (shipment: Shipment) => {
          const matchingShipmentNumber = shipment?.shipmentNumber?.toLowerCase()?.includes(searchTerm.toLowerCase());

          const matchingContainer = _.find(shipment?.availableContainers, (container: Container) =>
            container.containerNumber?.toLowerCase()?.includes(searchTerm.toLowerCase())
          );

          const matchingLotNumberOrProduct = _.find(shipment?.shipmentItems, (item: ShipmentItems) => {
            const matchingLotNumber =
              item.lotNumber?.toLowerCase()?.includes(searchTerm.toLowerCase()) ||
              item.inventoryItem?.lotNumber?.toLowerCase()?.includes(searchTerm.toLowerCase());
            const matchingCode = item.inventoryItem?.product?.productCode
              ?.toLowerCase()
              ?.includes(searchTerm.toLowerCase());
            const matchingName = item.inventoryItem?.product?.name?.toLowerCase()?.includes(searchTerm.toLowerCase());
            return matchingLotNumber || matchingCode || matchingName;
          });

          const matchingPackingLocation =
            shipment?.packingStatusDetails?.packingLocation?.locationNumber
              ?.toLowerCase()
              ?.includes(searchTerm.toLowerCase()) ||
            shipment?.packingStatusDetails?.packingLocation?.name?.toLowerCase()?.includes(searchTerm.toLowerCase());

          // Return as bool
          return !!(
            matchingShipmentNumber ||
            matchingContainer ||
            matchingLotNumberOrProduct ||
            matchingPackingLocation
          );
        });

        if (filteredShipments?.length === 0) {
          showPopup({
            message: `No shipment associated with the given identifier: ${searchTerm}`
          });
          this.resetFiltering();
          return;
        }

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
  };

  renderPackingList(shipment: ListRenderItemInfo<Shipment>) {
    const renderData: LabeledDataType[] = [
      { label: 'Shipment Number', value: shipment.item.shipmentNumber },
      { label: 'Status', value: shipment.item.displayStatus },
      { label: 'Destination', value: shipment.item.destination.name },
      { label: 'Expected Shipping Date', value: shipment.item.expectedShippingDate },
      { label: 'Packing Location', value: shipment.item.packingLocation, defaultValue: 'Unassigned' },
      { label: 'Items Packed', value: shipment.item.packingStatusDetails?.statusMessage, defaultValue: 'Not Available' }
    ];

    return (
      <Card style={common.listItemContainer} onPress={() => this.showShipmentReadyToPackScreen(shipment.item)}>
        <Card.Content>
          <DetailsTable data={renderData} />
        </Card.Content>
      </Card>
    );
  }


  render() {
    return (
      <View style={[common.containerFlexColumn, common.flex1]}>
        <BarcodeSearchHeader
          autoSearch
          placeholder={'Search or scan barcode'}
          resetSearch={this.resetFiltering}
          searchBox={false}
          onSearchTermSubmit={this.filterShipments}
        />
        <View style={[common.containerFlexColumn, common.flex1]}>
          <FlatList
            data={this.state.filteredShipments.length > 0 ? this.state.filteredShipments : this.state.shipments}
            ListEmptyComponent={
              <EmptyView title="Packing" description=" There are no items to pack" isRefresh={false} />
            }
            renderItem={this.renderPackingList}
            keyExtractor={(item) => item.id}
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
