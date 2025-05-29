import _ from 'lodash';
import React from 'react';
import { FlatList, ListRenderItemInfo, Text, View } from 'react-native';
import { Card, Chip, Divider, Subheading } from 'react-native-paper';
import { connect } from 'react-redux';

import { LayoutStyle } from '../../assets/styles';
import BarcodeSearchHeader from '../../components/BarcodeSearchHeader/BarcodeSearchHeader';
import EmptyView from '../../components/EmptyView';
import showPopup from '../../components/Popup';
import { HYPHEN } from '../../constants';
import { Container } from '../../data/container/Container';
import { Shipment } from '../../data/container/Shipment';
import ShipmentItems from '../../data/inbound/ShipmentItems';
import { hideScreenLoading, showScreenLoading } from '../../redux/actions/main';
import { getShipmentsReadyToBePacked } from '../../redux/actions/packing';
import { RootState } from '../../redux/reducers';
import { parseDateToISODate, parseFromISODateToLocaleString } from '../../utils/utils';
import styles from './styles';
import { DispatchProps, Props, State } from './types';

// List of shipments ready for packing
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
      shipment: shipment
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
              <EmptyView title="Packing" description=" There are no items to pack" isRefresh={false} />
            }
            renderItem={(shipment: ListRenderItemInfo<Shipment>) => {
              const parsedExpectedShippingDate = parseDateToISODate(shipment.item?.expectedShippingDate || '');
              const formattedExpectedShippingDate = parseFromISODateToLocaleString(parsedExpectedShippingDate);

              return (
                <Card
                  style={LayoutStyle.listItemContainer}
                  onPress={() => this.showShipmentReadyToPackScreen(shipment.item)}
                >
                  <Card.Content>
                    <View style={styles.headerRow}>
                      <View style={styles.dividedValues}>
                        <Text style={styles.value}>{shipment.item.shipmentNumber}</Text>
                      </View>
                      <Chip style={styles.chipWarning} textStyle={styles.chipWarningText}>
                        {shipment.item.status}
                      </Chip>
                    </View>
                    <Divider style={styles.dividerHorizontal} />

                    <Subheading style={styles.subheading}>
                      {`Destination: ${shipment.item?.destination?.name}`}
                    </Subheading>
                    <View style={styles.additionalInfoRow}>
                      <Chip icon="calendar" style={styles.chipDefault} textStyle={styles.chipDefaultText}>
                        {`Expected Shipping: ${formattedExpectedShippingDate}`}
                      </Chip>
                    </View>
                    <Divider style={styles.dividerHorizontal} />

                    <View style={styles.rowItem}>
                      <View style={styles.columnItem}>
                        <Text style={styles.label}>Packing Location</Text>
                        <Text style={styles.value}>{shipment.item.packingLocation ?? HYPHEN}</Text>
                      </View>

                      <View style={styles.columnItem}>
                        <Text style={styles.label}>Loading Location</Text>
                        <Text style={styles.value}>{shipment.item.loadingLocation ?? HYPHEN}</Text>
                      </View>
                    </View>
                  </Card.Content>
                </Card>
              );
            }}
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
