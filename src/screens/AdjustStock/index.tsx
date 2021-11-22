/* eslint-disable no-shadow */
import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import styles from './styles';
import {Image, ScrollView, Text, View, ToastAndroid} from 'react-native';
import InputBox from '../../components/InputBox';
import Button from '../../components/Button';
import showPopup from '../../components/Popup';
import {useNavigation, useRoute} from '@react-navigation/native';
import SelectDropdown from 'react-native-select-dropdown';
import RenderData from '../../components/RenderData';
import {RootState} from '../../redux/reducers';
import {stockAdjustments} from '../../redux/actions/products';

const reasonCodes = [
    {
        "value": "CONSUMED",
        "label": "Consumed",
        "sortOrder": 24
    },
    {
        "value": "CORRECTION",
        "label": "Correction",
        "sortOrder": 30
    },
    {
        "value": "DAMAGED",
        "label": "Damaged product",
        "sortOrder": 4
    },
    {
        "value": "DATA_ENTRY_ERROR",
        "label": "Data entry error",
        "sortOrder": 16
    },
    {
        "value": "EXPIRED",
        "label": "Expired product",
        "sortOrder": 3
    },
    {
        "value": "FOUND",
        "label": "Found",
        "sortOrder": 26
    },
    {
        "value": "MISSING",
        "label": "Missing",
        "sortOrder": 27
    },
    {
        "value": "RECOUNTED",
        "label": "Recounted",
        "sortOrder": 29
    },
    {
        "value": "REJECTED",
        "label": "Rejected",
        "sortOrder": 32
    },
    {
        "value": "RETURNED",
        "label": "Returned",
        "sortOrder": 25
    },
    {
        "value": "SCRAPPED",
        "label": "Scrapped",
        "sortOrder": 31
    },
    {
        "value": "STOLEN",
        "label": "Stolen",
        "sortOrder": 28
    },
    {
        "value": "OTHER",
        "label": "Other",
        "sortOrder": 100
    }
];

const AdjustStock = () => {
  const dispatch = useDispatch();
  const route = useRoute();
  const {item}: any = route.params;
  const navigation = useNavigation();
  const location = useSelector(
    (state: RootState) => state.mainReducer.currentLocation,
  );
  const [state, setState] = useState<any>({
    comments: '',
    quantityAdjusted: '',
    reasonCode: '',
    reasonCodeList: [],
    error: null,
  });
  useEffect(() => {
    let reasonList: any = [];
    reasonCodes.forEach(function (item) {
      reasonList.push(item.name);
    });
    state.reasonCodeList = reasonList;
    setState({...state});
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSave = () => {
    let errorTitle = '';
    let errorMessage = '';
    if (state.quantityAdjusted === null || state.quantityAdjusted === '') {
      errorTitle = 'Quantity!';
      errorMessage = 'Please fill the Quantity to Adjusted';
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
      'location.id': location.id,
      'product.id': item.product.id,
      'inventoryItem.id': item?.inventoryItem?.id ?? '',
      'binLocation.id': item?.binLocation?.id ?? '',
      quantityAvailable: item.quantityAvailableToPromise,
      reasonCode: state?.reasonCode?.id ?? 'CORRECTION',
      quantityAdjusted: state.quantityAdjusted,
      comments: state.comments,
    };
    submitStockAdjustments(request);
  };

  const onChangeComment = (text: string) => {
    setState({...state, comments: text});
  };

  const onChangeQuantity = (text: string) => {
    setState({...state, quantityAdjusted: text});
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
            },
          },
          negativeButtonText: 'Cancel',
        });
      } else {
        if (data && Object.keys(data).length !== 0) {
          ToastAndroid.show(
            'Stock adjustment saved successfully',
            ToastAndroid.SHORT,
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
            title={'Product Code'}
            subText={item?.product.productCode}
          />
          <RenderData title={'Product Name'} subText={item?.product.name} />
        </View>
        <View style={styles.rowItem}>
          <RenderData
            title={'Lot Number'}
            subText={item?.inventoryItem.lotNumber ?? 'Default'}
          />
          <RenderData
            title={'Expiration Date'}
            subText={item?.inventoryItem.expirationDate ?? 'Never'}
          />
        </View>
        <View style={styles.rowItem}>
          <RenderData
            title={'Bin Location'}
            subText={item?.binLocation?.name ?? 'Default'}
          />
          <RenderData
            title={'Quantity Available'}
            subText={item.quantityAvailableToPromise}
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

  return (
    <ScrollView style={styles.container}>
      <RenderItem />
      <View style={styles.from}>
        <InputBox
          label={'Quantity Adjusted'}
          value={state.quantityAdjusted}
          onChange={onChangeQuantity}
          disabled={false}
          editable={false}
          keyboard={'number-pad'}
        />
        <Text style={styles.value}>{'Reason Code'}</Text>
        <SelectDropdown
          data={state.reasonCodeList}
          onSelect={(selectedItem, index) => {
            state.reasonCode = selectedItem;
            setState({...state});
          }}
          defaultValueByIndex={0}
          renderDropdownIcon={renderIcon}
          buttonStyle={styles.select}
          buttonTextAfterSelection={(selectedItem, index) => selectedItem}
          rowTextForSelection={(item, index) => item}
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
        <Button
          disabled={
            state?.comments?.length > 0 &&
            state?.reasonCode?.length > 0 &&
            state.quantityAdjusted?.length > 0
              ? false
              : true
          }
          title="Adjust Stock"
          onPress={onSave}
        />
      </View>
    </ScrollView>
  );
};

export default AdjustStock;
