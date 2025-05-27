import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useState } from 'react';
import { ToastAndroid, View } from 'react-native';
import { Caption, Chip, Divider, Subheading } from 'react-native-paper';
import DropDown from 'react-native-paper-dropdown';
import { useDispatch, useSelector } from 'react-redux';

import Button from '../../components/Button';
import InputBox from '../../components/InputBox';
import InputSpinner from '../../components/InputSpinner';
import showPopup from '../../components/Popup';
import { HYPHEN } from '../../constants';
import { stockAdjustments } from '../../redux/actions/products';
import { RootState } from '../../redux/reducers';
import Theme from '../../utils/Theme';
import styles from './styles';

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
  const location = useSelector((state: RootState) => state.mainReducer.currentLocation);

  const [comments, setComments] = useState('');
  const [quantityAdjusted, setQuantityAdjusted] = useState(item.quantityAvailable);
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
      'inventoryItem.id': item?.['inventoryItem.id'] ?? '',
      'binLocation.id': item?.binLocation?.id ?? '',
      quantityAvailable: item.quantityAvailable,
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
          ToastAndroid.show('Stock adjustment saved successfully', ToastAndroid.SHORT);
          navigation.goBack();
          route?.params?.onSelect(data?.data[0]);
        }
      }
    };
    dispatch(stockAdjustments(requestBody, callback));
  };

  return (
    <>
      <View style={styles.infoContainer}>
        <View style={styles.headerRow}>
          <Chip icon="pin" style={styles.chipDefault} textStyle={styles.chipText}>
            {`Bin Location: ${item?.binLocation?.name ?? 'Default'}`}
          </Chip>
          <Chip icon="calendar" style={styles.chipDefault} textStyle={styles.chipText}>
            {`Expiration Date: ${item?.expirationDate ?? 'Never'}`}
          </Chip>
        </View>
        <Divider style={{ marginVertical: Theme.spacing.medium }} />

        <Subheading style={styles.subheading}>{`${item?.product.productCode} - ${item?.product.name}`}</Subheading>
        <Caption style={styles.caption}>{`Lot Number: ${item?.lotNumber ?? 'Default'}`}</Caption>

        <View style={styles.additionalInfoRow}>
          <Chip icon="package" style={styles.chipDefault} textStyle={styles.chipText}>
            {`Quantity Available: ${item.quantityAvailable ?? HYPHEN}`}
          </Chip>
        </View>
      </View>
      <Divider />

      <View style={styles.formContainer}>
        <InputSpinner title={'Quantity Adjusted'} value={quantityAdjusted} setValue={setQuantityAdjusted} />
        <View style={styles.dropdownDivider} />
        <DropDown
          label="Reason Code"
          mode="outlined"
          visible={showDropDown}
          showDropDown={() => setShowDropDown(true)}
          value={reasonCode}
          setValue={setReasonCode}
          list={reasonCodes}
          onDismiss={() => setShowDropDown(false)}
        />
        <InputBox value={comments} disabled={false} editable={false} label="Comments" onChange={setComments} />
        <Button
          style={styles.button}
          disabled={!comments || !reasonCode}
          title="Adjust Stock"
          size="100%"
          onPress={onSave}
        />
      </View>
    </>
  );
};

export default AdjustStock;
