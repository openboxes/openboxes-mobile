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
import { hideScreenLoading, showScreenLoading } from '../../redux/actions/main';
import { getShipmentsReadyToBePacked } from '../../redux/actions/packing';
import { RootState } from '../../redux/reducers';
import { parseDateToISODate, parseFromISODateToLocaleString } from '../../utils/utils';
import styles from '../OutboundStockList/styles';
import { DispatchProps, Props, State } from '../OutboundStockList/types';

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
        _.find(shipment?.containers, (container: Container) => container.containerNumber === searchTerm)
      );

      if (exactShipmentByLPN) {
        const exactContainer = _.find(
          exactShipmentByLPN?.containers,
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
          shipment?.loadingLocationNumber?.toLowerCase()?.includes(searchTerm.toLowerCase()) ||
          shipment?.loadingLocation?.toLowerCase()?.includes(searchTerm.toLowerCase());

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
            renderItem={(shipment: ListRenderItemInfo<Shipment>) => {
              const parsedExpectedShippingDate = parseDateToISODate(shipment?.item?.expectedShippingDate || '');
              const formattedExpectedShippingDate = parseFromISODateToLocaleString(parsedExpectedShippingDate);

              return (
                <Card
                  style={LayoutStyle.listItemContainer}
                  onPress={() => this.showLoadingDetailsScreen(shipment.item)}
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
                        <Text style={styles.label}>Loading Location</Text>
                        <Text style={styles.value}>{shipment.item.loadingLocation ?? HYPHEN}</Text>
                      </View>
                      <View style={styles.columnItem}>
                        <Text style={styles.label}>Expected Delivery Date</Text>
                        <Text style={styles.value}>{shipment.item.expectedDeliveryDate ?? HYPHEN}</Text>
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

export default connect(mapStateToProps, mapDispatchToProps)(OutboundLoadingList);
