import { DispatchProps, Props, State } from './types';
import React from 'react';
import { Text, View, BackHandler } from 'react-native';
import { connect } from 'react-redux';
import { hideScreenLoading, showScreenLoading } from '../../redux/actions/main';
import { RootState } from '../../redux/reducers';
import styles from './styles';
import { getShipmentReadyToBePacked } from '../../redux/actions/packing';
import OutboundVMMapper from './OutboubVmMapper';
import ContainerDetails from './ContainerDetails';
import Button from '../../components/Button';
import * as NavigationService from '../../NavigationService';
import { ROUTES } from '../../utils';

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
    BackHandler.addEventListener('hardwareBackPress',() => {
      NavigationService.navigate('OutboundStockList');
      return true
   })
    this.fetchShipment();
  } 

  componentDidUpdate() {
    if (this.props.route.params.refetchShipment) {
      this.fetchShipment();
    }
  }

  componentWillUnmount(){
    BackHandler.removeEventListener('hardwareBackPress', () => {return true})
  }

  fetchShipment = () => {
    const { shipmentId } = this.props.route.params;
    this.props.navigation.setParams({ refetchShipment : false });
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
      <View style={styles.screenContainer}>
        <View style={styles.contentContainer}>
          <View style={styles.row}>
            <View style={styles.col50}>
              <Text style={styles.label}>Shipment Number</Text>
              <Text style={styles.value}>
                {this.state.shipment?.shipmentNumber}
              </Text>
            </View>
            <View style={styles.col50}>
              <Text style={styles.label}>Status</Text>
              <Text style={styles.value}>{this.state.shipment?.status}</Text>
            </View>
          </View>
          <View style={styles.row}>
            <View style={styles.col50}>
              <Text style={styles.label}>Origin</Text>
              <Text style={styles.value}>
                {this.state.shipment?.origin.name}
              </Text>
            </View>
            <View style={styles.col50}>
              <Text style={styles.label}>Destination</Text>
              <Text style={styles.value}>
                {this.state.shipment?.destination.name}
              </Text>
            </View>
          </View>
          <View style={styles.row}>
            <View style={styles.col50}>
              <Text style={styles.label}>Expected Shipping Date</Text>
              <Text style={styles.value}>
                {this.state.shipment?.expectedShippingDate}
              </Text>
            </View>
            <View style={styles.col50}>
              <Text style={styles.label}>Expected Delivery Date</Text>
              <Text style={styles.value}>
                {this.state.shipment?.expectedDeliveryDate}
              </Text>
            </View>
          </View>
          <View style={styles.row}>
            <View style={styles.col50}>
              <Text style={styles.label}>Number of items</Text>
              <Text style={styles.value}>
                {this.state.shipment?.shipmentItems.length}
              </Text>
            </View>
          </View>
          <ContainerDetails item={this.state.shipmentData?.sectionData ?? []} />
          <Button
            title={'Create LPN'}
            onPress={() => {
              this.props.navigation.navigate('CreateLpn', {
                id: this?.state?.shipment?.id,
                shipmentDetail: this?.state?.shipment
              });
            }}
            disabled={false}
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
  getShipmentReadyToBePacked
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(OutboundStockDetails);
