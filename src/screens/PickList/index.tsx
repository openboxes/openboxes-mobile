import React, { useState } from 'react';
import produce from 'immer';
import _ from 'lodash';
import styles from './styles';
import { ListRenderItemInfo, Text, View, ToastAndroid } from 'react-native';
import { useDispatch } from 'react-redux';
import showPopup from '../../components/Popup';
import { submitPickListItem } from '../../redux/actions/orders';
import Button from '../../components/Button';
import InputBox from '../../components/InputBox';
import Carousel from 'react-native-snap-carousel';
import { device } from '../../constants';
import { PicklistItem } from '../../data/picklist/PicklistItem';
import InputSpinner from '../../components/InputSpinner';
import { Card }  from 'react-native-paper';
import SCAN from '../../assets/images/scan.jpg';
import TICK from '../../assets/images/tick.png';
import CLEAR from '../../assets/images/icon_clear.png';
import Radio from '../../components/Radio';
import DropDown from 'react-native-paper-dropdown';

// TODO: Refactor (pull from api, when shortage reason codes will be available)
const SHORTAGE_REASON_CODES = [
  { value: 'CONSUMED', label: 'CONSUMED' },
  { value: 'CORRECTION', label: 'CORRECTION' },
  { value: 'DAMAGED', label: 'DAMAGED' },
  { value: 'DATA_ENTRY_ERROR', label: 'DATA_ENTRY_ERROR' },
  { value: 'EXPIRED', label: 'EXPIRED' },
  { value: 'FOUND', label: 'FOUND' },
  { value: 'MISSING', label: 'MISSING' },
  { value: 'RECOUNTED', label: 'RECOUNTED' },
  { value: 'REJECTED', label: 'REJECTED' },
  { value: 'RETURNED', label: 'RETURNED' },
  { value: 'SCRAPPED', label: 'SCRAPPED' },
  { value: 'STOLEN', label: 'STOLEN' },
  { value: 'OTHER', label: 'OTHER' }
];

const PickOrderItem = (props: any) => {
  const dispatch = useDispatch();

  const [picklistItems, setPicklistItems] = useState<any>(props.pickList ? props.pickList.picklistItems : []);
  const [showDropDown, setShowDropDown] = useState<boolean>(false);

  const formSubmit = (id: string) => {
    const itemToSave = _.find(picklistItems, item => item.id === id);

    try {
      let errorTitle = '';
      let errorMessage = '';

      const scannedLotNumberValid = isPropertyValid(itemToSave, 'lotNumber', 'scannedLotNumber');
      const scannedBinLocationValid = isPropertyValid(itemToSave, 'binLocation.locationNumber', 'scannedBinLocation');

      if (!scannedLotNumberValid || !scannedBinLocationValid) {
        errorTitle = 'Lot number and bin location are invalid';
        errorMessage = 'Scan proper lot number and bin location';
      }

      if (!Number(itemToSave.quantityToPick) && !itemToSave.shortage) {
        errorTitle = 'Quantity To Pick!';
        errorMessage = 'Please pick some quantity.';
      } else if (Number(itemToSave.quantityToPick) > Number(itemToSave.quantityRemaining)) {
        errorTitle = 'Quantity To Pick!';
        errorMessage = 'Quantity to pick cannot exceed quantity remaining!';
      }

      if (itemToSave.shortage && !itemToSave.shortageReasonCode) {
        errorTitle = 'Shortage Reason Code!';
        errorMessage = 'You have to provide Reason Code for item shortage!';
      }

      if (errorTitle != '') {
        showPopup({
          title: errorTitle,
          message: errorMessage,
        });
        return Promise.resolve(null);
      }

      const requestBody = {
        'product.id': itemToSave['product.id'],
        productCode: itemToSave.productCode,
        quantityPicked: itemToSave.quantityToPick,
        shortage: itemToSave.shortage,
        shortageReasonCode: itemToSave.shortageReasonCode,
      };

      const actionCallback = (data: any) => {
        if (data && data.error) {
          showPopup({
            title: data.errorMessage ? 'Failed to pick item' : null,
            message: data.errorMessage || 'Failed to pick item',
          });
        } else {
          ToastAndroid.show('Picked item successfully!', ToastAndroid.SHORT);
          props.successfulPickCallback();
        }
      };

      dispatch(
        submitPickListItem(
          itemToSave.id as string,
          requestBody,
          actionCallback,
        )
      );
    } catch (e) {
      const title = e.message ? 'Failed submit item' : null;
      const message = e.message  || 'Failed submit item';
      showPopup({
        title: title,
        message: message,
        negativeButtonText: 'Cancel',
      });
      return Promise.resolve(null);
    }
  };

  const setPicklistItemsHelper = (value: string | number | boolean, index: number, property: string) => {
    setPicklistItems(
      produce((draft: any) => {
        const item = draft.find((item: any, draftIndex: number) => draftIndex === index);
        item[property] = value;
      })
    );
  };

  const setPicklistItemsQuantityHelper = (quantity: number, quantityRemaining: number, index: number) => {
    setPicklistItems(
      produce((draft: any) => {
        const item = draft.find((item: any, draftIndex: number) => draftIndex === index);
        item.quantityToPick = quantity;
        if (quantity === quantityRemaining) {
          item.shortage = false;
          item.shortageReasonCode = '';
        }
      })
    );
  };

  const isPropertyValid = (item: any, property: string, scannedProperty: string) => {
    if (!item[property] && !item[scannedProperty]) {
      return true;
    }

    return item[property] === item[scannedProperty];
  }

  const getIcon = (item: any, property: string, scannedProperty: string) => {
    const isScannedPropertyValid = isPropertyValid(item, property, scannedProperty);

    if ((!item[property] && !item[scannedProperty]) || isScannedPropertyValid) {
      return TICK;
    }

    if (!item[scannedProperty]) {
      return SCAN;
    }

    return CLEAR;
  }

  return (
    <View style={styles.screenContainer}>
        <Carousel
          key={3}
          sliderWidth={device.windowWidth}
          sliderHeight={device.windowHeight}
          activeSlideAlignment="start"
          itemWidth={device.windowWidth-20}
          data={picklistItems}
          firstItem={props.selectedPinkItemIndex ? props.selectedPinkItemIndex : 0}
          scrollEnabled={true}
          pointerEvents={'none'}
          lockScrollWhileSnapping
          renderItem={({item, index}: ListRenderItemInfo<PicklistItem>) => {
            return (
              <Card key={index}>
                <Card.Content>
                  <View style={styles.inputContainer}>
                    <View style={styles.listItemContainer}>
                      <View style={styles.row}>
                        <View style={styles.col50}>
                          <Text style={styles.label}>Product Code</Text>
                          <Text style={styles.value}>{item?.productCode}</Text>
                        </View>
                        <View style={styles.col50}>
                          <Text style={styles.label}>Product Name</Text>
                          <Text style={styles.value}>
                            {item?.['product.name']}
                          </Text>
                        </View>
                      </View>
                    </View>
                    <View>
                      <InputBox
                        value={item.scannedLotNumber}
                        placeholder={item.lotNumber || 'Lot Number'}
                        label={item.lotNumber || 'Lot Number'}
                        disabled={false}
                        onEndEdit={(value: any) => setPicklistItemsHelper(value, index, 'scannedLotNumber')}
                        onChange={(value: any) => setPicklistItemsHelper(value, index, 'scannedLotNumber')}
                        editable
                        icon={getIcon(item, 'lotNumber', 'scannedLotNumber')}
                        onIconClick={() => {
                          if (item.scannedLotNumber && !isPropertyValid(item, 'lotNumber', 'scannedLotNumber')) {
                            setPicklistItemsHelper('', index, 'scannedLotNumber')
                            return;
                          }
                          showPopup({
                            message: `Scan lot number. Expected: ${item.lotNumber || 'DEFAULT (empty)'}.\n\nTo validate lot number click on this field and scan lot number.`,
                            positiveButton: {
                              text: 'Ok',
                            },
                          })
                        }}
                      />
                    </View>
                    <View>
                      <View style={styles.row}>
                        <View style={styles.col33}>
                          <Text style={styles.label}>Location</Text>
                          <Text style={styles.value}>
                            {item?.['binLocation.name']}
                          </Text>
                        </View>
                        <View style={styles.col33}>
                          <Text style={styles.label}>Type</Text>
                          <Text style={styles.value}>
                            {item?.['binLocation.locationType']}
                          </Text>
                        </View>
                        <View style={styles.col33}>
                          <Text style={styles.label}>Zone</Text>
                          <Text style={styles.value}>
                            {item?.['binLocation.zoneName']??'None'}
                          </Text>
                        </View>
                      </View>
                      <InputBox
                        value={item.scannedBinLocation}
                        placeholder={item['binLocation.locationNumber']}
                        label={item['binLocation.locationNumber'] || 'Bin Location'}
                        disabled={false}
                        onEndEdit={(value: any) => setPicklistItemsHelper(value, index, 'scannedBinLocation')}
                        onChange={(value: any) => setPicklistItemsHelper(value, index, 'scannedBinLocation')}
                        editable
                        icon={getIcon(item, 'binLocation.locationNumber', 'scannedBinLocation')}
                        onIconClick={() => {
                          if (item.scannedBinLocation && !isPropertyValid(item, 'binLocation.locationNumber', 'scannedBinLocation')) {
                            setPicklistItemsHelper('', index, 'scannedBinLocation')
                            return;
                          }
                          showPopup({
                            message: `Scan bin location. Expected: ${item['binLocation.locationNumber'] || 'DEFAULT (empty)'}.\n\nTo validate bin location click on this field and scan bin location.`,
                            positiveButton: {
                              text: 'Ok',
                            },
                          })
                        }}
                      />

                      <View style={styles.row}>
                        <View style={styles.col25}>
                          <Text style={styles.label}>Picked</Text>
                          <Text style={styles.value}>
                            {item?.quantityPicked} / {item?.quantity} {/* quantity is the "quantity required" for the picklist item */}
                          </Text>
                        </View>
                        <View style={styles.col25}>
                          <Text style={styles.label}>Remaining</Text>
                          <Text style={styles.value}>
                            {item?.quantityRemaining}
                          </Text>
                        </View>
                        <View style={styles.col25}>
                          <Text style={styles.label}>Shortage</Text>
                          <Text style={styles.value}>
                            {item?.quantityCanceled??0}
                          </Text>
                        </View>
                        <View style={styles.col25}>
                          <Text style={styles.label}>Reason</Text>
                          <Text style={styles.value}>
                            {item?.reasonCode??'None'}
                          </Text>
                        </View>
                      </View>

                      <View style={styles.inputSpinner}>
                        <InputSpinner
                          title={"Quantity to Pick"}
                          setValue={(value: any) => setPicklistItemsQuantityHelper(parseInt(value), item?.quantityRemaining, index)}
                          value={item.quantityToPick}
                        />
                      </View>
                      {item.quantityToPick < item.quantityRemaining && (
                        <Radio
                          title={"Shortage (not enough quantity to pick)"}
                          setChecked={(value: any) => setPicklistItemsHelper(value, index, 'shortage')}
                          checked={item.shortage}
                        />
                      )}
                      {item.quantityToPick < item.quantityRemaining && item.shortage && (
                        <DropDown
                          label="Shortage Reason Code"
                          mode="outlined"
                          visible={showDropDown}
                          showDropDown={() => setShowDropDown(true)}
                          onDismiss={() => setShowDropDown(false)}
                          value={item.shortageReasonCode}
                          setValue={(value: any) => setPicklistItemsHelper(value, index, 'shortageReasonCode')}
                          list={SHORTAGE_REASON_CODES}
                        />
                      )}
                      <Button title="Pick Item" onPress={() => formSubmit(item.id)} disabled={!item?.quantityRemaining} />
                    </View>
                  </View>
                </Card.Content>
              </Card>
            );
          }}
        />
    </View>
  );
};

export default PickOrderItem;
