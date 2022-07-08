import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styles from './styles';
import { Image, ScrollView, TouchableOpacity, View } from 'react-native';
import DatePicker from 'react-native-datepicker';
import InputBox from '../../components/InputBox';
import Button from '../../components/Button';
import showPopup from '../../components/Popup';
import { useNavigation, useRoute } from '@react-navigation/native';
import { submitPartialReceiving } from '../../redux/actions/inboundorder';
import { searchInternalLocations } from '../../redux/actions/locations';
import { RootState } from '../../redux/reducers';
import AsyncModalSelect from '../../components/AsyncModalSelect';
import InputSpinner from '../../components/InputSpinner';
import Radio from '../../components/Radio';
import CLEAR from '../../assets/images/icon_clear.png';
import SelectDropdown from 'react-native-select-dropdown';
import { Props as LabeledDataType } from '../../components/LabeledData/types';
import DetailsTable from "../../components/DetailsTable";

const renderIcon = () => {
  return <Image style={styles.arrowDownIcon} source={require('../../assets/images/arrow-down.png')} />;
};

const InboundReceiveDetail = () => {
  const dispatch = useDispatch();
  const route = useRoute();
  const { shipmentItem, shipmentData, shipmentId }: any = route.params;
  const [cancelRemaining, setCancelRemaining] = useState(false);
  const navigation = useNavigation();
  const location = useSelector((state: RootState) => state.mainReducer.currentLocation);
  const [state, setState] = useState<any>({
    comments: '',
    internalLocation: [],
    receiveLocation: {
      id: shipmentItem['binLocation.id'],
      label: shipmentItem['binLocation.name']
    },
    lotNumber: shipmentItem.lotNumber,
    expirationDate: shipmentItem.expirationDate,
    deliveryDate: shipmentData.expectedDeliveryDate,
    quantityToReceive: Number(shipmentItem.quantityRemaining) || 0,
    error: null
  });
  const [lotStatusCode, setLotStatusCode] = useState<string>('');
  useEffect(() => {
    getInternalLocation(location.id);
  }, [shipmentItem]);

  const onReceive = () => {
    let errorTitle = '';
    let errorMessage = '';

    if (Number(state.quantityToReceive) < 0) {
      errorTitle = 'Quantity!';
      errorMessage = 'Please fill the Quantity to Receive';
    }

    if (Number(state.quantityToReceive) === 0 && !cancelRemaining) {
      errorTitle = 'Quantity to receive is 0';
      errorMessage = 'You can\'t receive 0 without cancelling remaining';
    }

    if (state.expirationDate && !state.lotNumber) {
      errorTitle = 'Expiration date without Lot';
      errorMessage = 'Please fill the Lot Number if you want to set the Expiration Date';
    }

    if (errorTitle !== '') {
      showPopup({
        title: errorTitle,
        message: errorMessage,
        negativeButtonText: 'Cancel'
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
              'binLocation.id': state.receiveLocation?.id ?? '',
              lotNumber: state.lotNumber,
              expirationDate: state.expirationDate,
              recipient: '',
              quantityReceiving: state.quantityToReceive,
              cancelRemaining: cancelRemaining,
              quantityOnHand: '',
              comment: state.comments,
              mobile: true,
              lotStatusCode: lotStatusCode
            }
          ]
        }
      ]
    };

    if (Number(state.quantityToReceive) > Number(shipmentItem.quantityRemaining)) {
      showPopup({
        title: 'Quantity to receive is greater than quantity remaining',
        message: 'Are you sure you want to receive more?',
        negativeButtonText: 'No',
        positiveButton: {
          text: 'Yes',
          callback: () => submitReceiving(shipmentId, request)
        }
      });
      return Promise.resolve(null);
    }

    submitReceiving(shipmentId, request);
  };

  const onChangeComment = (text: string) => {
    setState({ ...state, comments: text });
  };

  const onChangeLotNumber = (text: string) => {
    setState({ ...state, lotNumber: text });
  };

  const clearSelection = () => {
    setState({ ...state, expirationDate: null });
  };

  const onChangeQuantity = (quantityToReceive: string) => {
    setState({ ...state, quantityToReceive });
    setCancelRemaining(
      cancelRemaining && Number(quantityToReceive) >= Number(shipmentItem.quantityRemaining) ? false : cancelRemaining
    );
  };

  const submitReceiving = (id: string, requestBody: any) => {
    const callback = (data: any) => {
      if (data?.error) {
        showPopup({
          title: data.message ? 'Inbound order details' : null,
          message: data.errorMessage ?? `Failed to load Inbound order details value ${id}`,
          positiveButton: {
            text: 'Retry',
            callback: () => {
              dispatch(submitPartialReceiving(id, requestBody, callback));
            }
          },
          negativeButtonText: 'Cancel'
        });
      } else {
        if (data && Object.keys(data).length !== 0) {
          if (data.receiptId !== '' && data.receipt !== '') {
            const receiptStatus = {
              receiptStatus: 'COMPLETED'
            };
            dispatch(submitPartialReceiving(id, receiptStatus, onComplete));
          }
        }
        setState({ ...state });
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
          text: 'Ok'
        }
      });
    } else {
      if (data && Object.keys(data).length !== 0) {
        navigation.goBack();
      }
    }
  };

  const detailsData: LabeledDataType[] = [
    { label: 'Shipment Number', value: shipmentData?.shipmentNumber },
    { label: 'Description', value: shipmentData?.name },
    { label: 'Product Code', value: shipmentItem['product.productCode'] },
    { label: 'Name', value: shipmentItem['product.name'] },
    { label: 'Lot / Serial Number', value: shipmentItem.lotNumber, defaultValue: 'Default' },
    { label: 'Expiration Date', value: shipmentItem.expirationDate, defaultValue: 'Never' },
    { label: 'Quantity Shipped', value: shipmentItem.quantityShipped },
    { label: 'Quantity Received', value: shipmentItem.quantityReceived }
  ];

  const getInternalLocation = (id: string = '') => {
    const callback = (data: any) => {
      if (data?.error) {
        showPopup({
          title: data.message ? 'internal location details' : '',
          message: data.errorMessage ?? `Failed to load internal location value ${id}`,
          positiveButton: {
            text: 'Retry',
            callback: () => {
              dispatch(
                searchInternalLocations(
                  '',
                  {
                    'parentLocation.id': location.id,
                    max: '25',
                    offset: '0'
                  },
                  callback
                )
              );
            }
          },
          negativeButtonText: 'Cancel'
        });
      } else {
        if (data && Object.keys(data).length !== 0) {
          let locationList: any[] = [];
          data.data.map((item: any) => {
            const locationData = {
              name: item.name,
              id: item.id
            };
            locationList.push(locationData);
          });
          state.internalLocation = locationList;
        }
        setState({ ...state });
      }
    };
    dispatch(
      searchInternalLocations(
        '',
        {
          'parentLocation.id': location.id,
          max: 25,
          offset: 0
        },
        callback
      )
    );
  };

  return (
    <ScrollView keyboardShouldPersistTaps="always" style={styles.container}>
      <DetailsTable data={detailsData} />
      <View style={styles.from}>
        <AsyncModalSelect
          placeholder="Receiving Location"
          label="Receiving Location"
          initValue={state.receiveLocation.label || ''}
          initialData={state.internalLocation}
          searchAction={searchInternalLocations}
          searchActionParams={{ 'parentLocation.id': location.id }}
          onSelect={(selectedItem: any) => {
            if (selectedItem) {
              state.receiveLocation = selectedItem;
              setState({ ...state });
            }
          }}
        />
        <InputBox
          value={state.lotNumber}
          disabled={false}
          editable={false}
          label={'Lot Number'}
          onChange={onChangeLotNumber}
        />
        <SelectDropdown
          renderDropdownIcon={renderIcon}
          data={['', 'APPROVED', 'RECALLED', 'ON_HOLD', 'QUARANTINED', 'EXPIRED', 'RESERVED', 'DAMAGED']}
          dropdownStyle={{ justifyContent: 'flex-start' }}
          defaultValue={lotStatusCode}
          buttonTextStyle={styles.lotStatusSelectTextStyle}
          buttonTextAfterSelection={(selectedItem) => selectedItem}
          dropdownIconPosition={'right'}
          defaultValueByIndex={0}
          buttonStyle={styles.lotStatusSelectStyle}
          rowTextForSelection={(item) => item}
          onSelect={(selectedItem, index) => {
            setLotStatusCode(index === 0 ? '' : selectedItem);
          }}
        />
        <View style={styles.datePickerContainer}>
          <DatePicker
            style={styles.datePicker}
            date={state.expirationDate}
            mode="date"
            placeholder="Expiration Date"
            format="MM/DD/YYYY"
            confirmBtnText="Confirm"
            cancelBtnText="Cancel"
            customStyles={styles.datePickerCustomStyle}
            onDateChange={(date: any) => {
              setState({ ...state, expirationDate: date });
            }}
          />
          {state.expirationDate ? (
            <TouchableOpacity onPress={clearSelection}>
              <Image source={CLEAR} style={styles.imageIcon} />
            </TouchableOpacity>
          ) : null}
        </View>
        <View style={styles.inputSpinner}>
          <InputSpinner title={'Quantity to Receive'} value={state.quantityToReceive} setValue={onChangeQuantity} />
        </View>
        <InputBox
          value={state.comments}
          disabled={false}
          editable={false}
          label={'Comments'}
          onChange={onChangeComment}
        />
      </View>
      <Radio
        title={'Cancel remaining quantity for this item'}
        setChecked={setCancelRemaining}
        checked={cancelRemaining}
        disabled={Number(state.quantityToReceive) >= Number(shipmentItem.quantityRemaining)}
      />
      <View style={styles.bottom}>
        <Button title="Receive" disabled={false} onPress={onReceive} />
      </View>
    </ScrollView>
  );
};

export default InboundReceiveDetail;
