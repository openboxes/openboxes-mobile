/* eslint-disable react-native/no-inline-styles */
import _ from 'lodash';
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styles from './styles';
import { View, Text, ToastAndroid } from 'react-native';
import InputBox from '../../components/InputBox';
import Button from '../../components/Button';
import { RootState } from '../../redux/reducers';
import { useNavigation, useRoute } from '@react-navigation/native';
import { updateStockTransfer } from '../../redux/actions/transfers';
import showPopup from '../../components/Popup';
import AsyncModalSelect from '../../components/AsyncModalSelect';
import { searchInternalLocations } from '../../redux/actions/locations';
import InputSpinner from '../../components/InputSpinner';
import { ContentContainer, ContentFooter, ContentBody } from '../../components/ContentLayout';

const Transfer = () => {
  const route = useRoute();
  const navigation = useNavigation<any>();
  const { item }: any = route.params;
  const dispatch = useDispatch();
  const location = useSelector((rootState: RootState) => rootState.mainReducer.currentLocation);
  const [binToLocationData, setBinToLocationData] = useState<any>({});
  const [quantity, setQuantity] = useState(0);
  const [internalLocations, setInternalLocations] = useState<any>([]);

  useEffect(() => {
    getInternalLocation(location.id);
  }, [item]);

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
          setInternalLocations(
            _.map(data.data, (internalLocation) => ({
              name: internalLocation.name,
              id: internalLocation.id
            }))
          );
        }
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

  const onTransfer = () => {
    let errorTitle = '';
    let errorMessage = '';
    if (Number(item.quantityAvailableToPromise) < quantity) {
      errorTitle = 'Quantity!';
      errorMessage = 'Quantity to transfer is greater than quantity available';
    }
    if (errorTitle !== '') {
      showPopup({
        title: errorTitle,
        message: errorMessage,
        negativeButtonText: 'Cancel'
      });
      return Promise.resolve(null);
    }

    const request: any = {
      status: 'COMPLETED',
      stockTransferNumber: '',
      description: '',
      'origin.id': location.id,
      'destination.id': location.id,
      stockTransferItems: [
        {
          'product.id': item.inventoryItem.product.id,
          'inventoryItem.id': item.inventoryItem.id,
          'location.id': location.id,
          'originBinLocation.id': item?.binLocation?.id,
          'destinationBinLocation.id': binToLocationData.id,
          quantity: quantity
        }
      ]
    };
    const actionCallback = (data: any) => {
      if (data?.error) {
        showPopup({
          title: data.errorMessage ? 'Submit' : 'Error',
          message: 'Failed to submit',
          positiveButton: {
            text: 'Retry',
            callback: () => {
              dispatch(updateStockTransfer(request, actionCallback));
            }
          },
          negativeButtonText: 'Cancel'
        });
      } else {
        const product = { id: item.inventoryItem.product.id };
        ToastAndroid.show('Transferred item successfully!', ToastAndroid.SHORT);
        navigation.navigate('ProductDetails', {
          product,
          refetchProduct: true
        });
      }
    };
    dispatch(updateStockTransfer(request, actionCallback));
  };

  return (
    <ContentContainer>
      <ContentBody>
        <InputBox disabled editable={false} label={'Product Code'} value={item?.product?.productCode} />
        <InputBox disabled editable={false} label={'Lot Number'} value={item?.inventoryItem?.lotNumber ?? 'Default'} />
        <InputBox
          disabled
          editable={false}
          label={'Expiration Date'}
          value={item?.inventoryItem?.expirationDate ?? 'Never'}
        />
        <InputBox disabled value={item?.binLocation?.name ?? 'Default'} label={'From'} editable={false} />
        <InputBox
          disabled
          label={'Quantity Available to Transfer'}
          value={item?.quantityAvailableToPromise?.toString()}
          editable={false}
        />
        <View style={styles.inputBin}>
          <Text>Bin Location</Text>
          <AsyncModalSelect
            placeholder="Bin Location"
            label="Bin Location"
            initValue={binToLocationData?.label || ''}
            initialData={internalLocations}
            searchAction={searchInternalLocations}
            searchActionParams={{ 'parentLocation.id': location.id }}
            onSelect={(selectedItem: any) => {
              if (selectedItem) {
                setBinToLocationData(selectedItem);
              }
            }}
          />
        </View>
        <View style={styles.inputSpinner}>
          <InputSpinner title="Quantity to Transfer" value={quantity} setValue={setQuantity} />
        </View>
      </ContentBody>
      <ContentFooter>
        <Button
          title="TRANSFER"
          style={{
            marginTop: 8
          }}
          disabled={binToLocationData && quantity <= 0}
          onPress={onTransfer}
        />
      </ContentFooter>
    </ContentContainer>
  );
};

export default Transfer;
