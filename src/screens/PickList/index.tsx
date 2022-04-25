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

const PickOrderItem = (props: any) => {
  const dispatch = useDispatch();

  const [picklistItems, setPicklistItems] = useState<any>(props.pickList ? props.pickList.picklistItems : []);

  const formSubmit = (id: string) => {
    const itemToSave = _.find(picklistItems, item => item.id === id);

    try {
      let errorTitle = '';
      let errorMessage = '';

      const scannedLotNumberValid = isPropertyValid(itemToSave, 'lotNumber', 'scannedLotNumber');
      const scannedBinLocationValid = isPropertyValid(itemToSave, 'binLocation.name', 'scannedBinLocation');

      if (!scannedLotNumberValid || !scannedBinLocationValid) {
        errorTitle = 'Lot number and bin location are invalid';
        errorMessage = 'Scan proper lot number and bin location';
      }

      if (!Number(itemToSave.quantityToPick)) {
        errorTitle = 'Quantity To Pick!';
        errorMessage = 'Please pick some quantity.';
      } else if (Number(itemToSave.quantityToPick) > Number(itemToSave.quantityRemaining)) {
        errorTitle = 'Quantity To Pick!';
        errorMessage = 'Quantity to pick cannot exceed quantity remaining!';
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

  const setPicklistItemsHelper = (value: string | number, index: number, property: string) => {
    setPicklistItems(
      produce((draft: any) => {
        const item = draft.find((item: any, draftIndex: number) => draftIndex === index);
        item[property] = value;
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
      <View style={styles.swiperView}>
        <Carousel
          key={3}
          sliderWidth={device.windowWidth}
          sliderHeight={device.windowHeight}
          itemWidth={device.windowWidth - 70}
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

                      <View style={styles.row}>
                        <View style={styles.col50}>
                          <Text style={styles.label}>Picked</Text>
                          <Text style={styles.value}>
                            {item?.quantityPicked} / {item?.quantityRequested}
                          </Text>
                        </View>
                        <View style={styles.col50}>
                          <Text style={styles.label}>Remaining</Text>
                          <Text style={styles.value}>
                            {item?.quantityRemaining}
                          </Text>
                        </View>
                      </View>
                    </View>
                    <View style={styles.from}>
                      <InputBox
                        value={item.productCode}
                        disabled={true}
                        editable={false}
                        label={'Product Code'}
                      />
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
                      <InputBox
                        // TODO: Change it to work against the binLocation.locationNumber instead of binLocation.name
                        value={item.scannedBinLocation}
                        placeholder={item['binLocation.name']}
                        label={item['binLocation.name'] || 'Bin Location'}
                        disabled={false}
                        onEndEdit={(value: any) => setPicklistItemsHelper(value, index, 'scannedBinLocation')}
                        onChange={(value: any) => setPicklistItemsHelper(value, index, 'scannedBinLocation')}
                        editable
                        icon={getIcon(item, 'binLocation.name', 'scannedBinLocation')}
                        onIconClick={() => {
                          if (item.scannedBinLocation && !isPropertyValid(item, 'binLocation.name', 'scannedBinLocation')) {
                            setPicklistItemsHelper('', index, 'scannedBinLocation')
                            return;
                          }
                          showPopup({
                            message: `Scan bin location. Expected: ${item['binLocation.name'] || 'DEFAULT (empty)'}.\n\nTo validate bin location click on this field and scan bin location.`,
                            positiveButton: {
                              text: 'Ok',
                            },
                          })
                        }}
                      />
                      <View style={styles.inputSpinner}>
                        <InputSpinner
                          title={"Quantity to Pick"}
                          setValue={(value: any) => setPicklistItemsHelper(parseInt(value), index, 'quantityToPick')}
                          value={item.quantityToPick}
                        />
                      </View>
                      <Button title="Pick Item" onPress={() => formSubmit(item.id)} disabled={!item?.quantityRemaining} />
                    </View>
                  </View>
                </Card.Content>
              </Card>
            );
          }}
        />
      </View>
    </View>
  );
};

export default PickOrderItem;
