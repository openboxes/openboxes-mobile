/* eslint-disable react-native/no-inline-styles */
import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { Image, ScrollView, TouchableOpacity, View } from 'react-native';
import DatePicker from 'react-native-datepicker';
import { Caption, Chip, Divider, Subheading, Text } from 'react-native-paper';
import SelectDropdown from 'react-native-select-dropdown';
import { useDispatch, useSelector } from 'react-redux';

import CLEAR from '../../assets/images/icon_clear.png';
import AsyncModalSelect from '../../components/AsyncModalSelect';
import Button from '../../components/Button';
import InputBox from '../../components/InputBox';
import InputSpinner from '../../components/InputSpinner';
import showPopup from '../../components/Popup';
import Radio from '../../components/Radio';
import { submitPartialReceiving } from '../../redux/actions/inboundorder';
import { searchInternalLocations } from '../../redux/actions/locations';
import { RootState } from '../../redux/reducers';
import Theme from '../../utils/Theme';
import styles from './styles';

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

    if (Number(state.quantityToReceive) > Number(shipmentItem.quantityRemaining)) {
      errorTitle = 'You are receiving more than the remaining quantity';
      errorMessage = 'It is not possible to receive more than the remaining quantity';
    }

    if (Number(state.quantityToReceive) === 0 && !cancelRemaining) {
      errorTitle = 'Quantity to receive is 0';
      errorMessage = 'You cannot receive 0 without cancelling remaining';
    }

    if (state.expirationDate && !state.lotNumber) {
      errorTitle = 'Expiration date without Lot';
      errorMessage = 'Please fill the Lot Number if you want to set the Expiration Date';
    }

    if (errorTitle !== '') {
      showPopup({
        title: errorTitle,
        message: errorMessage
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
    <ScrollView keyboardShouldPersistTaps="always">
      <View style={styles.inboundDetailsContainer}>
        <View style={styles.headerRow}>
          <Chip icon="barcode" style={styles.chipDefault} textStyle={styles.chipWarningText}>
            {shipmentItem['product.productCode']}
          </Chip>
          <Chip icon="calendar" style={[styles.chipDefault, styles.lastChild]} textStyle={styles.chipWarningText}>
            {`Expiration Date: ${shipmentItem?.expirationDate || 'Never'}`}
          </Chip>
        </View>
        <Divider style={styles.dividerHorizontal} />

        <Subheading style={{ fontWeight: 'bold' }}> {shipmentItem['product.name']} </Subheading>
        <Caption> {shipmentData?.name} </Caption>
        <Divider style={styles.dividerHorizontal} />

        <View style={styles.additionalInfoRow}>
          <View style={styles.columnItem}>
            <Text style={styles.label}>{'Shipment Number'}</Text>
            <Text style={styles.value}>{shipmentData?.shipmentNumber || ''}</Text>
          </View>
          <View style={styles.columnItem}>
            <Text style={styles.label}>{'Lot / Serial Number'}</Text>
            <Text style={styles.value}>{shipmentItem?.lotNumber || 'Default'}</Text>
          </View>
        </View>
        <Divider style={styles.dividerHorizontal} />

        <View style={styles.rowItem}>
          <Chip icon="truck" style={{ ...styles.chipDefault, flex: 1 }} textStyle={styles.chipWarningText}>
            {`Shipped: ${shipmentItem.quantityShipped}`}
          </Chip>
          <Chip
            icon="database"
            style={{ ...styles.chipDefault, ...styles.lastChild, flex: 1 }}
            textStyle={styles.chipWarningText}
          >
            {`Remaining: ${shipmentItem.quantityRemaining > 0 ? shipmentItem.quantityRemaining : 0}`}
          </Chip>
        </View>

        <View style={styles.rowItem}>
          <Chip
            icon="thumb-up"
            style={{ ...styles.chipDefault, ...styles.lastChild, flex: 1, marginTop: Theme.spacing.small }}
            textStyle={styles.chipWarningText}
          >
            {`Received: ${shipmentItem.quantityReceived}`}
          </Chip>
        </View>
      </View>
      <Divider />
      <View style={styles.container}>
        <View style={styles.from}>
          <View style={styles.itemView}>
            <InputSpinner title={'Quantity to Receive'} value={state.quantityToReceive} setValue={onChangeQuantity} />
          </View>
          <Radio
            title={'Cancel remaining quantity for this item'}
            setChecked={setCancelRemaining}
            checked={cancelRemaining}
            disabled={Number(state.quantityToReceive) >= Number(shipmentItem.quantityRemaining)}
          />
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
          <InputBox
            value={state.comments}
            disabled={false}
            editable={false}
            label={'Comments'}
            onChange={onChangeComment}
          />
        </View>
      </View>
      <Divider />
      <View style={styles.bottom}>
        <Button size="100%" title="Receive" disabled={false} onPress={onReceive} />
      </View>
    </ScrollView>
  );
};

export default InboundReceiveDetail;
