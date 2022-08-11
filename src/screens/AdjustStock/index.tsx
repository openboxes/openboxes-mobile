import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { common, margin } from '../../assets/styles';
import { View, ToastAndroid } from 'react-native';
import InputBox from '../../components/InputBox';
import Button from '../../components/Button';
import showPopup from '../../components/Popup';
import { useNavigation, useRoute } from '@react-navigation/native';
import DropDown from 'react-native-paper-dropdown';
import { RootState } from '../../redux/reducers';
import { stockAdjustments } from '../../redux/actions/products';
import InputSpinner from '../../components/InputSpinner';
import DetailsTable from '../../components/DetailsTable';
import { Props as LabeledDataType } from '../../components/LabeledData/types';
import { ContentContainer, ContentFooter, ContentBody, ContentHeader } from '../../components/ContentLayout';

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
  const [quantityAdjusted, setQuantityAdjusted] = useState(item.quantityAvailableToPromise);
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
          ToastAndroid.show('Stock adjustment saved successfully', ToastAndroid.SHORT);
          navigation.goBack();
          route?.params?.onSelect(data?.data[0]);
        }
      }
    };
    dispatch(stockAdjustments(requestBody, callback));
  };

  const renderData: LabeledDataType[] = [
    { label: 'Product Code', value: item?.product.productCode },
    { label: 'Product Name', value: item?.product.name },
    { label: 'Lot Number', value: item?.inventoryItem.lotNumber, defaultValue: 'Default' },
    { label: 'Expiration Date', value: item?.inventoryItem.expirationDate, defaultValue: 'Never' },
    { label: 'Bin Location', value: item?.binLocation?.name, defaultValue: 'Default' },
    { label: 'Quantity Available', value: item.quantityAvailableToPromise }
  ];

  return (
    <ContentContainer>
      <ContentHeader>
        <DetailsTable data={renderData} />
      </ContentHeader>
      <ContentBody>
        <View style={[common.containerCenter, margin.MB3]}>
          <InputSpinner title={'Quantity Adjusted'} value={quantityAdjusted} setValue={setQuantityAdjusted} />
        </View>
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
      </ContentBody>
      <ContentFooter>
        <Button disabled={!comments || !reasonCode} title="Adjust Stock" onPress={onSave} />
      </ContentFooter>
    </ContentContainer>
  );
};

export default AdjustStock;
