import { DispatchProps, Props, State } from './types';
import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import { Card, Title, Paragraph } from 'react-native-paper';
import { connect } from 'react-redux';
import { hideScreenLoading, showScreenLoading } from '../../redux/actions/main';
import { RootState } from '../../redux/reducers';
import styles from './styles';
import { getShipment } from '../../redux/actions/packing';
import OutboundVMMapper from './OutboubVmMapper';
import ContainerDetails from './ContainerDetails';
import Button from '../../components/Button';

// Shipment packing
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
    this.props.getShipment(shipmentId, actionCallback);
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
                <Text style={styles.value}>
                  {this.state.shipment?.packingLocation?.name ?? 'Unassigned'}
                </Text>
              </View>
              <View style={styles.col50}>
                <Text style={styles.label}>Items Packed</Text>
                <Text style={styles.value}>
                  {}{this.state.shipment?.packingStatusDetails?.statusMessage}
                </Text>
              </View>
            </View>
          </View>
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
