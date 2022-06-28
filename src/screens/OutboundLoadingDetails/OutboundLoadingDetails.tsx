import { DispatchProps, Props, State } from '../OutboundStockDetails/types';
import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import { connect } from 'react-redux';
import { hideScreenLoading, showScreenLoading } from '../../redux/actions/main';
import { RootState } from '../../redux/reducers';
import styles from '../OutboundStockDetails/styles';
import { getShipment } from '../../redux/actions/packing';
import OutboundVMMapper from '../OutboundStockDetails/OutboubVmMapper';

// Shipment loading
class OutboundLoadingDetails extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      error: null,
      shipment: null,
      shipmentData: null
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

  actionCallback = (data: any) => {
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

  fetchShipment = () => {
    const { shipmentId } = this.props.route.params;
    this.props.navigation.setParams({ refetchShipment: false });
    this.props.showScreenLoading('Loading..');
    this.props.getShipment(shipmentId, this.actionCallback);
  };

  render() {
    return (
      <ScrollView style={styles.screenContainer}>
        <View style={styles.contentContainer}>
          <View style={styles.row}>
            <View style={styles.col50}>
              <Text style={styles.label}>Shipment Number</Text>
              <Text style={styles.value}>{this.state.shipment?.shipmentNumber}</Text>
            </View>
            <View style={styles.col50}>
              <Text style={styles.label}>Status</Text>
              <Text style={styles.value}>{this.state.shipment?.requisitionStatus}</Text>
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
              <Text style={styles.label}>Loading Location</Text>
              <Text style={styles.value}>{this.state.shipment?.loadingLocation}</Text>
            </View>
            <View style={styles.col50}>
              <Text style={styles.label}>Expected Delivery Date</Text>
              <Text style={styles.value}>{this.state.shipment?.expectedDeliveryDate}</Text>
            </View>
          </View>
          <View style={styles.row}>
            <View style={styles.col50}>
              <Text style={styles.label}>LPNs To Be Loaded</Text>
              <Text style={styles.value}>{this.state.shipment?.availableContainers.length}</Text>
            </View>
          </View>
        </View>
      </ScrollView>
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

export default connect(mapStateToProps, mapDispatchToProps)(OutboundLoadingDetails);
