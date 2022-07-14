import React from 'react';
import styles from './styles';
import { ListRenderItemInfo, View, ToastAndroid } from 'react-native';
import { useDispatch } from 'react-redux';
import showPopup from '../../components/Popup';
import { submitPickListItem } from '../../redux/actions/orders';
import Carousel from 'react-native-snap-carousel';
import { device } from '../../constants';
import { PicklistItem } from '../../data/picklist/PicklistItem';

import PickListItem from "../../components/PickListItem";

const PickOrderItem = ({ picklistItems, selectedPicklistItemIndex, successfulPickCallback }: any) => {
  const dispatch = useDispatch();

  const formSubmit = (itemToSave: any) => {
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

      if (errorTitle !== '') {
        showPopup({
          title: errorTitle,
          message: errorMessage
        });
        return Promise.resolve(null);
      }

      const requestBody = {
        'product.id': itemToSave['product.id'],
        productCode: itemToSave.productCode,
        quantityPicked: itemToSave.quantityToPick,
        shortage: itemToSave.shortage,
        shortageReasonCode: itemToSave.shortageReasonCode
      };

      const actionCallback = (data: any) => {
        if (data && data.error) {
          showPopup({
            title: data.errorMessage ? 'Failed to pick item' : null,
            message: data.errorMessage || 'Failed to pick item'
          });
        } else {
          ToastAndroid.show('Picked item successfully!', ToastAndroid.SHORT);
          successfulPickCallback();
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
      const message = e.message || 'Failed submit item';
      showPopup({
        title: title,
        message: message,
        negativeButtonText: 'Cancel'
      });
      return Promise.resolve(null);
    }
  };

  const isPropertyValid = (item: any, property: string, scannedProperty: string) => {
    if (!item[property] && !item[scannedProperty]) {
      return true;
    }

    return item[property] === item[scannedProperty];
  };

  return (
    <View style={styles.screenContainer}>
      <Carousel
        scrollEnabled
        useScrollView
        lockScrollWhileSnapping
        firstItem={selectedPicklistItemIndex ? selectedPicklistItemIndex : 0}
        itemWidth={device.windowWidth - 20}
        data={picklistItems}
        sliderWidth={device.windowWidth}
        key={selectedPicklistItemIndex}
        sliderHeight={device.windowHeight}
        pointerEvents={'none'}
        activeSlideAlignment="start"
        renderItem={({ item }: ListRenderItemInfo<PicklistItem>) => {
          return <PickListItem item={item} onPickItem={formSubmit} />;
        }}
      />
    </View>
  );
};

export default PickOrderItem;
