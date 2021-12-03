import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import styles from './styles';
import {Image, ScrollView, Text, View} from 'react-native';
import InputBox from '../../components/InputBox';
import Button from '../../components/Button';
import showPopup from '../../components/Popup';
import {useNavigation, useRoute} from '@react-navigation/native';
import {submitPartialReceiving} from '../../redux/actions/inboundorder';
import {getInternalLocations} from '../../redux/actions/locations';
import {RootState} from '../../redux/reducers';
import AutoInputInternalLocation from '../../components/AutoInputInternalLocation';
import InputSpinner from '../../components/InputSpinner';

const InboundReceiveDetail = () => {
  const dispatch = useDispatch();
  const route = useRoute();
  const {shipmentItem, shipmentData, shipmentId}: any = route.params;
  const [cancelRemaining, setCancelRemaining] = useState(false);
  const navigation = useNavigation();
  const location = useSelector(
    (state: RootState) => state.mainReducer.currentLocation,
  );
  const [state, setState] = useState<any>({
    comments: '',
    internalLocation: [],
    receiveLocation: shipmentItem['binLocation.name'],
    deliveryDate: shipmentData.expectedDeliveryDate,
    quantityToReceive: shipmentItem.quantityRemaining.toString(),
    error: null,
  });
  useEffect(() => {
    getInternalLocation(location.id);
  }, [shipmentItem]);

  const onReceive = () => {
    let errorTitle = '';
    let errorMessage = '';
    if (state.quantityToReceive == null || state.quantityToReceive == '') {
      errorTitle = 'Quantity!';
      errorMessage = 'Please fill the Quantity to Receive';
    } else if (
      parseInt(state.quantityToReceive, 10) >
      parseInt(state.quantityRemaining, 10)
    ) {
      errorTitle = 'Quantity!';
      errorMessage = 'Quantity to Receive is greater than quantity remaining';
    }
    if (errorTitle !== '') {
      showPopup({
        title: errorTitle,
        message: errorMessage,
        negativeButtonText: 'Cancel',
      });
      return Promise.resolve(null);
    }
    const request = {
      receiptId: '',
      receiptStatus: 'PENDING',
      shipmentId: shipmentId,
      containers: [
        {
          'container.id': shipmentItem['container.id'] ?? '',
          shipmentItems: [
            {
              receiptItemId: '',
              shipmentItemId: shipmentItem.shipmentItemId,
              'container.id': shipmentItem['container.id'] ?? '',
              'product.id': shipmentItem['product.id'] ?? '',
              'binLocation.id': state.receiveLocation ?? '',
              recipient: '',
              quantityReceiving: state.quantityToReceive,
              cancelRemaining: cancelRemaining,
              quantityOnHand: '',
              comment: state.comments,
            },
          ],
        },
      ],
    };
    submitReceiving(shipmentId, request);
  };

  const onChangeComment = (text: string) => {
    setState({...state, comments: text});
  };

  const onChangeDate = (text: string) => {
    setState({...state, deliveryDate: text});
  };
  const onChangeQuantity = (text: string) => {
    setState({...state, quantityToReceive: text});
  };
  const submitReceiving = (id: string, requestBody: any) => {
    const callback = (data: any) => {
      if (data?.error) {
        showPopup({
          title: data.message ? 'Inbound order details' : null,
          message:
            data.errorMessage ??
            `Failed to load Inbound order details value ${id}`,
          positiveButton: {
            text: 'Retry',
            callback: () => {
              dispatch(submitPartialReceiving(id, requestBody, callback));
            },
          },
          negativeButtonText: 'Cancel',
        });
      } else {
        if (data && Object.keys(data).length !== 0) {
          if (data.receiptId !== '' && data.receipt != '') {
            const receiptStatus = {
              receiptStatus: 'COMPLETED',
            };
            dispatch(submitPartialReceiving(id, receiptStatus, onComplete));
          }
        }
        setState({...state});
      }
    };
    dispatch(submitPartialReceiving(id, requestBody, callback));
  };

  const onComplete = (data: any) => {
    if (data?.error) {
      showPopup({
        title: data.errorMessage ? 'In Bound order details' : 'Error',
        message: data.errorMessage ?? 'Failed to load Inbound order details',
        positiveButton: {
          text: 'Ok',
        },
      });
    } else {
      if (data && Object.keys(data).length !== 0) {
        navigation.goBack();
      }
    }
  };
  const RenderData = ({title, subText}: any): JSX.Element => {
    return (
      <View style={styles.columnItem}>
        <Text style={styles.label}>{title}</Text>
        <Text style={styles.value}>{subText}</Text>
      </View>
    );
  };

  const RenderShipmentItem = (): JSX.Element => {
    return (
      <View style={styles.itemView}>
        <View style={styles.rowItem}>
          <RenderData
            title={'Shipment Number'}
            subText={shipmentData?.shipmentNumber}
          />
          <RenderData title={'Description'} subText={shipmentData?.name} />
        </View>
        <View style={styles.rowItem}>
          <RenderData
            title={'Product Code'}
            subText={shipmentItem['product.productCode']}
          />
          <RenderData title={'Name'} subText={shipmentItem['product.name']} />
        </View>
        <View style={styles.rowItem}>
          <RenderData
            title={'Lot / Serial Number'}
            subText={shipmentItem.lotNumber ?? 'Default'}
          />
          <RenderData
            title={'Expiration Date'}
            subText={shipmentItem.expirationDate ?? 'N/A'}
          />
        </View>
        <View style={styles.rowItem}>
          <RenderData
            title={'Quantity Shipped'}
            subText={shipmentItem.quantityShipped}
          />
          <RenderData
            title={'Quantity Received'}
            subText={shipmentItem.quantityReceived}
          />
        </View>
      </View>
    );
  };
  const renderIcon = () => {
    return (
      <Image
        style={styles.arrowDownIcon}
        source={require('../../assets/images/arrow-down.png')}
      />
    );
  };

  const getInternalLocation = (id: string = '') => {
    const callback = (data: any) => {
      if (data?.error) {
        showPopup({
          title: data.message ? 'internal location details' : '',
          message:
            data.errorMessage ?? `Failed to load internal location value ${id}`,
          positiveButton: {
            text: 'Retry',
            callback: () => {
              dispatch(getInternalLocations(id, callback));
            },
          },
          negativeButtonText: 'Cancel',
        });
      } else {
        if (data && Object.keys(data).length !== 0) {
          let locationList: string[] = [];
          data.data.map((item: any) => {
            locationList.push(item.name);
          });
          state.internalLocation = locationList;
        }
        setState({...state});
      }
    };
    dispatch(getInternalLocations(id, callback));
  };
  return (
    <ScrollView keyboardShouldPersistTaps="always" style={styles.container}>
      <RenderShipmentItem />
      <View style={styles.from}>
        <Text style={styles.label}>{'Receiving Location'}</Text>
        <AutoInputInternalLocation
          label="AutoInputInternalLocation"
          data={state.internalLocation}
          getMoreData={(d: any) => console.log('get More data api call', d)} // for calling api for more results
          selectedData={(selectedItem: any) => {
            if (selectedItem) {
              state.receiveLocation = selectedItem;
              setState({...state});
            }
          }}
        />
        <InputSpinner
          title={'Quantity to Receive'}
          value={state.quantityToReceive}
          setValue={onChangeQuantity}
        />
        <InputBox
          value={state.comments}
          onChange={onChangeComment}
          disabled={false}
          editable={false}
          label={'Comments'}
        />
      </View>
      <View style={styles.bottom}>
        <Button title="Receive" onPress={onReceive} />
      </View>
    </ScrollView>
  );
};

export default InboundReceiveDetail;
