import React from 'react';
import showPopup from '../../components/Popup';
import { saveAndUpdateLpn } from '../../redux/actions/lpn';
import { DispatchProps, Props } from './Types';
import { connect } from 'react-redux';
import { Text, ToastAndroid, View } from 'react-native';
import { Order } from '../../data/order/Order';
import styles from './styles';
import InputBox from '../../components/InputBox';
import Button from '../../components/Button';
import {
  getShipmentOrigin,
  getShipmentPacking
} from '../../redux/actions/packing';
import { RootState } from '../../redux/reducers';
import AutoInputInternalLocation from '../../components/AutoInputInternalLocation';

export interface State {
  stockMovements: Order[] | null;
  open: false;
  stockMovement: Order | null;
  name: string | null;
  containerNumber: string | null;
  stockMovementList: string[] | [];
  stockMovementId: string | any;
}

class CreateLpn extends React.Component<Props, State> {
  // eslint-disable-next-line complexity
  constructor(props: Props) {
    super(props);
    const { id, shipmentDetail } = this.props?.route?.params ?? '';
    this.state = {
      stockMovements: shipmentDetail?.shipmentNumber || null,
      stockMovement: shipmentDetail?.shipmentNumber || null,
      stockMovementList: [],
      open: false,
      name: null,
      containerNumber: null,
      stockMovementId: id || null
    };
  }

  componentDidMount() {
    this.getShipmentOrigin();
  }

  fetchContainerList = () => {
    const actionCallback = (data: any) => {
      if (data?.error) {
        showPopup({
          title: data.errorMessage ? 'Container' : 'Error',
          message: data.errorMessage ?? 'Failed to fetch Container List',
          positiveButton: {
            text: 'Ok'
          }
        });
      } else {
        let stockMovementList: string[] = [];
      }
    };
    this.props.getShipmentPacking('OUTBOUND', actionCallback);
  };

  getShipmentOrigin = () => {
    const { currentLocation, selectedLocation } = this.props;
    const actionCallback = (data: any) => {
      if (data?.error) {
        showPopup({
          title: data.errorMessage ? 'StockMovements' : 'Error',
          message: data.errorMessage ?? 'Failed to fetch StockMovements',
          positiveButton: {
            text: 'Ok'
          }
        });
      } else {
        let stockMovementList: string[] = [];
        data.map((item: any) => {
          stockMovementList.push(item.shipmentNumber);
        });
        this.setState({
          stockMovementList: stockMovementList,
          stockMovements: data
        });
      }
    };
    this.props.getShipmentOrigin(selectedLocation?.id ?? '', actionCallback);
  };

  saveLpn = () => {
    const requestBody = {
      name: this.state.name,
      containerNumber: this.state.containerNumber,
      'containerType.id': '2',
      'shipment.id': this.state.stockMovementId
    };
    // eslint-disable-next-line complexity
    const actionCallback = (data: any) => {
      if (data?.error) {
        showPopup({
          title: data.errorMessage ? 'Failed to Save' : null,
          message: data.errorMessage ?? 'Failed to Save',
          positiveButton: {
            text: 'Retry',
            callback: () => {
              this.props.saveAndUpdateLpn(requestBody, actionCallback);
            }
          },
          negativeButtonText: 'Cancel'
        });
      } else {
        ToastAndroid.show('LPN submitted successfully!!', ToastAndroid.SHORT);
        if (data && Object.keys(data).length !== 0) {
          this.props.navigation.navigate('LpnDetail', {
            id: data.id,
            shipmentNumber: this.state.stockMovement
          });
        }
      }
    };
    this.props.saveAndUpdateLpn(requestBody, actionCallback);
  };

  onChangeName = (text: string) => {
    this.setState({
      name: text
    });
  };

  onChangeContainerNumber = (text: string) => {
    this.setState({
      containerNumber: text
    });
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.from}>
          <Text style={styles.label}>Shipment Number</Text>
          <AutoInputInternalLocation
            label="AutoInputInternalLocation"
            data={this.state.stockMovementList}
            initValue={this.state.stockMovements}
            selectedData={(selectedItem: any, index: number) => {
              const stockMovement = this.state.stockMovements?.find(
                (i) => i.shipmentNumber === selectedItem
              );
              this.setState({
                stockMovement: selectedItem,
                stockMovementId: stockMovement?.id
              });
            }}
          />
          <InputBox
            value={this.state.name}
            editable={false}
            label={'Name'}
            onChange={this.onChangeName}
          />
          <InputBox
            value={this.state.containerNumber}
            editable={false}
            label={'Container Number'}
            onChange={this.onChangeContainerNumber}
          />
        </View>
        <View style={styles.bottom}>
          <Button
            title="Submit"
            // eslint-disable-next-line react-native/no-inline-styles
            style={{
              marginTop: 8
            }}
            onPress={this.saveLpn}
          />
        </View>
      </View>
    );
  }
}

const mapStateToProps = (state: RootState) => ({
  selectedLocation: state.locationsReducer.SelectedLocation,
});
const mapDispatchToProps: DispatchProps = {
  getShipmentPacking,
  getShipmentOrigin,
  saveAndUpdateLpn
};

export default connect(mapStateToProps, mapDispatchToProps)(CreateLpn);
