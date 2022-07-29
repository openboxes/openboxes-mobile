import React from 'react';
import showPopup from '../../components/Popup';
import { saveAndUpdateLpn } from '../../redux/actions/lpn';
import { DispatchProps, Props } from './types';
import { connect } from 'react-redux';
import { Text, ToastAndroid } from 'react-native';
import { Order } from '../../data/order/Order';
import { margin, typography } from '../../assets/styles';
import InputBox from '../../components/InputBox';
import Button from '../../components/Button';
import { getShipmentOrigin } from '../../redux/actions/packing';
import { RootState } from '../../redux/reducers';
import AutoInputInternalLocation from '../../components/AutoInputInternalLocation';
import { ContentContainer, ContentFooter, ContentBody } from '../../components/ContentLayout';

export interface State {
  stockMovements: Order[] | null;
  open: false;
  stockMovement: Order | null;
  name: string | null;
  containerNumber: string | null;
  stockMovementList: any[] | [];
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

  getShipmentOrigin = () => {
    const { selectedLocation } = this.props;
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
        let stockMovementList: any = [];
        data.map((item: any) => {
          const shipmentData = {
            name: item.shipmentNumber,
            id: item.id
          };
          stockMovementList.push(shipmentData);
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
        this.props.navigation.navigate('LpnDetail', {
          id: data.id,
          shipmentNumber: this.state.stockMovement
        });
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
      <ContentContainer style={margin.M5}>
        <ContentBody>
          <Text style={typography.label}>Shipment Number</Text>
          <AutoInputInternalLocation
            label="AutoInputInternalLocation"
            data={this.state.stockMovementList}
            initValue={this.state.stockMovements}
            selectedData={(selectedItem: any, index: number) => {
              this.setState({
                stockMovement: selectedItem.name,
                stockMovementId: selectedItem?.id
              });
            }}
          />
          <InputBox value={this.state.name} editable={false} label={'Name'} onChange={this.onChangeName} />
          <InputBox
            value={this.state.containerNumber}
            editable={false}
            label={'Container Number'}
            onChange={this.onChangeContainerNumber}
          />
        </ContentBody>
        <ContentFooter>
          <Button title="Submit" onPress={this.saveLpn} disabled={false} />
        </ContentFooter>
      </ContentContainer>
    );
  }
}

const mapStateToProps = (state: RootState) => ({
  selectedLocation: state.mainReducer.currentLocation
});
const mapDispatchToProps: DispatchProps = {
  getShipmentOrigin,
  saveAndUpdateLpn
};

export default connect(mapStateToProps, mapDispatchToProps)(CreateLpn);
