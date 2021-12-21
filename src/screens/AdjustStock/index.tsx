/* eslint-disable no-shadow */
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styles from './styles';
import { ScrollView, View, ToastAndroid } from 'react-native';
import InputBox from '../../components/InputBox';
import Button from '../../components/Button';
import showPopup from '../../components/Popup';
import { useNavigation, useRoute } from '@react-navigation/native';
import DropDown from 'react-native-paper-dropdown';
import RenderData from '../../components/RenderData';
import { RootState } from '../../redux/reducers';
import { stockAdjustments } from '../../redux/actions/products';
import InputSpinner from '../../components/InputSpinner';

const reasonCodes = [
  {
    value: '',
    label: ' ',
    sortOrder: 0
  },
  {
    value: 'CONSUMED',
    label: 'Consumed',
    sortOrder: 24
  },
  {
    value: 'CORRECTION',
    label: 'Correction',
    sortOrder: 30
  },
  {
    value: 'DAMAGED',
    label: 'Damaged product',
    sortOrder: 4
  },
  {
    value: 'DATA_ENTRY_ERROR',
    label: 'Data entry error',
    sortOrder: 16
  },
  {
    value: 'EXPIRED',
    label: 'Expired product',
    sortOrder: 3
  },
  {
    value: 'FOUND',
    label: 'Found',
    sortOrder: 26
  },
  {
    value: 'MISSING',
    label: 'Missing',
    sortOrder: 27
  },
  {
    value: 'RECOUNTED',
    label: 'Recounted',
    sortOrder: 29
  },
  {
    value: 'REJECTED',
    label: 'Rejected',
    sortOrder: 32
  },
  {
    value: 'RETURNED',
    label: 'Returned',
    sortOrder: 25
  },
  {
    value: 'SCRAPPED',
    label: 'Scrapped',
    sortOrder: 31
  },
  {
    value: 'STOLEN',
    label: 'Stolen',
    sortOrder: 28
  },
  {
    value: 'OTHER',
    label: 'Other',
    sortOrder: 100
  }
];

const AdjustStock = () => {
  const dispatch = useDispatch();
  const route = useRoute();
  const { item }: any = route.params;
  const navigation = useNavigation();
  const location = useSelector(
    (state: RootState) => state.mainReducer.currentLocation
  );

  const [comments, setComments] = useState('');
  const [quantityAdjusted, setQuantityAdjusted] = useState('0');
  const [reasonCode, setReasonCode] = useState(null);
  const [showDropDown, setShowDropDown] = useState(false);

  const onSave = () => {
    let errorTitle = '';
    let errorMessage = '';
    if (quantityAdjusted === null || quantityAdjusted === '') {
      errorTitle = 'Quantity!';
      errorMessage = 'Please fill the Quantity to Adjusted';
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
      'location.id': location.id,
      'product.id': item.product.id,
      'inventoryItem.id': item?.inventoryItem?.id ?? '',
      'binLocation.id': item?.binLocation?.id ?? '',
      quantityAvailable: item.quantityAvailableToPromise,
      reasonCode: reasonCode ?? 'CORRECTION',
      quantityAdjusted: quantityAdjusted,
      comments: comments
    };
    submitStockAdjustments(request);
  };

  const submitStockAdjustments = (requestBody: any) => {
    const callback = (data: any) => {
      if (data?.error) {
        showPopup({
          title: 'Unable to save stock adjustment',
          message: data.message ?? 'Unexpected error occurred on the server',
          positiveButton: {
            text: 'Retry',
            callback: () => {
              dispatch(stockAdjustments(requestBody, callback));
            }
          },
          negativeButtonText: 'Cancel'
        });
      } else {
        if (data && Object.keys(data).length !== 0) {
          ToastAndroid.show(
            'Stock adjustment saved successfully',
            ToastAndroid.SHORT
          );
          navigation.goBack();
          route?.params?.onSelect(data?.data[0]);
        }
      }
    };
    dispatch(stockAdjustments(requestBody, callback));
  };

  const RenderItem = (): JSX.Element => {
    return (
      <View style={styles.itemView}>
        <View style={styles.rowItem}>
          <RenderData
            title="Product Code"
            subText={item?.product.productCode}
          />
          <RenderData title="Product Name" subText={item?.product.name} />
        </View>
        <View style={styles.rowItem}>
          <RenderData
            title="Lot Number"
            subText={item?.inventoryItem.lotNumber ?? 'Default'}
          />
          <RenderData
            title="Expiration Date"
            subText={item?.inventoryItem.expirationDate ?? 'Never'}
          />
        </View>
        <View style={styles.rowItem}>
          <RenderData
            title="Bin Location"
            subText={item?.binLocation?.name ?? 'Default'}
          />
          <RenderData
            title="Quantity Available"
            subText={item.quantityAvailableToPromise}
          />
        </View>
      </View>
    );
  };

  return (
    <ScrollView style={styles.container}>
      <RenderItem />
      <View style={styles.from}>
        <InputSpinner
          title={'Quantity Adjusted'}
          value={quantityAdjusted}
          setValue={setQuantityAdjusted}
        />
        <View style={styles.dropDownDivider} />
        <DropDown
          label="Reason Code"
          mode="outlined"
          visible={showDropDown}
          showDropDown={() => setShowDropDown(true)}
          onDismiss={() => setShowDropDown(false)}
          value={reasonCode}
          setValue={setReasonCode}
          list={reasonCodes}
        />
        <InputBox
          value={comments}
          onChange={setComments}
          disabled={false}
          editable={false}
          label="Comments"
        />
      </View>
      <View style={styles.bottom}>
        <Button
          disabled={!comments || !reasonCode}
          title="Adjust Stock"
          onPress={onSave}
        />
      </View>
    </ScrollView>
  );
};

export default AdjustStock;
