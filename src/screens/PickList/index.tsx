import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ListRenderItemInfo, ToastAndroid, View } from 'react-native';
import { Divider, Text } from 'react-native-paper';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useDispatch, useSelector } from 'react-redux';

import PickListItem from '../../components/PickListItem';
import showPopup from '../../components/Popup';
import { device } from '../../constants';
import { PicklistItem } from '../../data/picklist/PicklistItem';
import { submitPickListItem } from '../../redux/actions/orders';
import { RootState } from '../../redux/reducers';
import Theme from '../../utils/Theme';
import styles from './styles';

const PickOrderItem = ({ picklistItems, selectedPicklistItemIndex, successfulPickCallback }: any) => {
  const [activeIndex, setActiveIndex] = useState(selectedPicklistItemIndex || 0);
  const dispatch = useDispatch();
  const carouselRef = useRef<Carousel<any>>(null);
  const { productSummaryConfig } = useSelector((state: RootState) => state.settingsReducer);

  const showLotNumber = useMemo(() => productSummaryConfig?.lotNumber !== false, [productSummaryConfig]);

  useEffect(() => {
    if (carouselRef.current) {
      const newIndex = selectedPicklistItemIndex || 0;
      carouselRef.current.snapToItem(newIndex);
      setActiveIndex(newIndex);
    }
  }, [picklistItems, selectedPicklistItemIndex]);

  const formSubmit = (itemToSave: any) => {
    try {
      let errorTitle = '';
      let errorMessage = '';

      const scannedLotNumberValid = isPropertyValid(itemToSave, 'lotNumber', 'scannedLotNumber', showLotNumber);
      const scannedBinLocationValid = isPropertyValid(itemToSave, 'binLocation.name', 'scannedBinLocation');

      if (!scannedLotNumberValid) {
        errorTitle = 'Invalid Lot Number';
        errorMessage = 'Scanned Lot Number does not match the item Lot Number!';
      } else if (!scannedBinLocationValid) {
        errorTitle = 'Invalid Bin Location';
        errorMessage = 'Scanned Bin Location does not match the item Bin Location!';
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

      dispatch(submitPickListItem(itemToSave.id as string, requestBody, actionCallback));
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

  const isPropertyValid = (item: any, property: string, scannedProperty: string, enabled: boolean = true) => {
    if (!enabled || (!item[property] && !item[scannedProperty])) {
      return true;
    }

    return item[property] === item[scannedProperty];
  };

  const renderCarouselItem = ({ item }: ListRenderItemInfo<PicklistItem>) => {
    return <PickListItem item={item} onPickItem={formSubmit} />;
  };

  return (
    <>
      {/* Swipe Prompt */}
      {picklistItems && picklistItems.length > 1 && (
        <>
          <Divider />

          <View style={styles.swipePromptContainer}>
            <Icon name="swap-horizontal-bold" size={20} color={Theme.colors.warningForeground} />
            <Text style={styles.swipePromptText}>Swipe to navigate between items.</Text>
          </View>
        </>
      )}

      <Divider />

      <View style={styles.screenContainer}>
        <Carousel
          ref={carouselRef}
          sliderWidth={device.windowWidth}
          itemWidth={device.windowWidth * 0.95}
          inactiveSlideScale={0.9}
          inactiveSlideOpacity={0.7}
          activeSlideAlignment={'center'}
          data={picklistItems}
          renderItem={renderCarouselItem}
          firstItem={selectedPicklistItemIndex || 0}
          scrollEnabled
          lockScrollWhileSnapping
          useScrollView
          onSnapToItem={(index) => setActiveIndex(index)}
        />
        <Pagination
          dotsLength={picklistItems.length}
          activeDotIndex={activeIndex}
          containerStyle={{
            backgroundColor: 'transparent',
            paddingVertical: Theme.spacing.large,
            marginTop: Theme.spacing.small
          }}
          dotStyle={{
            width: 11,
            height: 11,
            borderRadius: Theme.roundness,
            marginHorizontal: Theme.spacing.small,
            backgroundColor: Theme.colors.primary
          }}
          inactiveDotOpacity={0.5}
          inactiveDotScale={0.5}
        />
      </View>
    </>
  );
};

export default PickOrderItem;
