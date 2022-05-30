import { DispatchProps, Props, State } from './types';
import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import { connect } from 'react-redux';
import { hideScreenLoading, showScreenLoading } from '../../redux/actions/main';
import { RootState } from '../../redux/reducers';
import styles from './styles';
import { getShipmentReadyToBePacked } from '../../redux/actions/packing';
import OutboundVMMapper from './OutboubVmMapper';
import ContainerDetails from './ContainerDetails';
import Button from '../../components/Button';

class OutboundStockDetails extends React.Component<Props, State> {
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
    this.props.getShipmentReadyToBePacked(shipmentId, actionCallback);
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
              <Text style={styles.label}>Packing Location</Text>
              <Text style={styles.value}>{this.state.shipment?.packingLocation}</Text>
            </View>
            <View style={styles.col50}>
              <Text style={styles.label}>Loading Location</Text>
              <Text style={styles.value}>{this.state.shipment?.loadingLocation}</Text>
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.col50}>
              <Text style={styles.label}>Number of containers</Text>
              <Text style={styles.value}>{this.state.shipment?.availableContainers.length}</Text>
            </View>
            <View style={styles.col50}>
              <Text style={styles.label}>Items packed</Text>
              <Text style={styles.value}>{this.state.shipment?.packingStatus}</Text>
            </View>
          </View>
          <ContainerDetails item={this.state.shipmentData?.sectionData ?? []} />
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
  getShipmentReadyToBePacked
};
export default connect(mapStateToProps, mapDispatchToProps)(OutboundStockDetails);
