import {DispatchProps, Props, State} from './types';
import React from 'react';
import {Text, View} from 'react-native';
import {connect} from 'react-redux';
import {hideScreenLoading, showScreenLoading} from '../../redux/actions/main';
import {RootState} from '../../redux/reducers';
import styles from './styles';
import {getShipmentReadyToBePacked} from '../../redux/actions/packing';
import OutboundVMMapper from './OutboubVmMapper';
import ContainerDetails from './ContainerDetails';
import Button from '../../components/Button';

class OutboundStockDetails extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      error: null,
      shipment: null,
      shipmentData: null,
    };
  }

  componentDidMount() {
    this.fetchShipment();
  }

  fetchShipment = () => {
    const {shipmentId} = this.props.route.params;
    const actionCallback = (data: any) => {
      if (!data || data?.error) {
        const title = data.error.message
          ? 'Failed to fetch Shipments Detail'
          : null;
        const message =
          data.error.message ??
          'Failed to fetch PutAway Detail with OrderNumber:';
        return Promise.resolve(null);
      } else {
        this.setState({
          shipment: data,
          shipmentData: OutboundVMMapper(data),
        });
      }
      this.props.hideScreenLoading();
    };
    this.props.getShipmentReadyToBePacked(shipmentId, actionCallback);
  };

  render() {
    // const {showList} = this.state
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
                shipmentDetail: this?.state?.shipment,
              });
            }}
            disabled={false}
          />
        </View>
      </View>
    );
  }
}

/*function renderPutAway(putAway: PutAway): ReactElement {
    return (
        <TouchableOpacity
            style={styles.listItemContainer}>
            <View style={styles.row}>
                <View style={styles.col50}>
                    <Text style={styles.label}>Status</Text>
                    <Text style={styles.value}>{putAway?.putawayStatus}</Text>
                </View>
                <View style={styles.col50}>
                    <Text style={styles.label}>PutAway Number</Text>
                    <Text style={styles.value}>{putAway?.putawayNumber}</Text>
                </View>

            </View>
            <View style={styles.row}>
                <View style={styles.col50}>
                    <Text style={styles.label}>Origin</Text>
                    <Text
                        style={styles.value}>{putAway?.["origin.name"]}</Text>
                </View>
                <View style={styles.col50}>
                    <Text style={styles.label}>Destination</Text>
                    <Text
                        style={styles.value}>{putAway?.["destination.name"]}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );
}*/

const mapStateToProps = (state: RootState) => ({
  SelectedLocation: state.locationsReducer.SelectedLocation,
});

const mapDispatchToProps: DispatchProps = {
  showScreenLoading,
  hideScreenLoading,
  getShipmentReadyToBePacked,
};
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(OutboundStockDetails);
