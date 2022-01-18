/* eslint-disable react-native/no-inline-styles */
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styles from './styles';
import { ScrollView, View, Text, ToastAndroid } from 'react-native';
import InputBox from '../../components/InputBox';
import Button from '../../components/Button';
import { RootState } from '../../redux/reducers';
import { useNavigation, useRoute } from '@react-navigation/native';
import { updateStockTransfer } from '../../redux/actions/transfers';
import showPopup from '../../components/Popup';
import { getBinLocationsAction } from '../../redux/actions/locations';
import AutoInputBinLocation from "../../components/AutoInputBinLocation";
import InputSpinner from "../../components/InputSpinner";

const Transfer = () => {
  const route = useRoute();
  const navigation = useNavigation<any>();
  const { item }: any = route.params;
  const dispatch = useDispatch();
  const location = useSelector(
    (rootState: RootState) => rootState.mainReducer.currentLocation
  );
  const binLocations = useSelector(
    (rootState: RootState) => rootState.locationsReducer.locations
  );
  const [binToLocationData, setBinToLocationData] = useState<any>({});
  const [quantity, setQuantity] = useState(0)
  useEffect(() => {
    dispatch(getBinLocationsAction())
  }, [])


  const onTransfer = () => {
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
        navigation.navigate('ProductDetails', { product });
      }
    };
    dispatch(updateStockTransfer(request, actionCallback));
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <View style={styles.from}>
          <InputBox
            disabled
            editable={false}
            label={'Product Code'}
            value={item?.product?.productCode}
          />
          <InputBox
            disabled
            editable={false}
            label={'Lot Number'}
            value={item?.inventoryItem?.lotNumber ?? 'Default'}
          />
          <InputBox
            disabled
            editable={false}
            label={'Expiration Date'}
            value={item?.inventoryItem?.expirationDate ?? 'Never'}
          />
          <InputBox
            disabled
            value={item?.binLocation?.name ?? 'Default'}
            label={'From'}
            editable={false}
          />
          <InputBox
            disabled
            label={'Quantity Available to Transfer'}
            value={item?.quantityAvailableToPromise?.toString()}
            editable={false}
          />
          <View style={styles.inputBin}>
            <Text>Bin Location</Text>
            <AutoInputBinLocation
              data={binLocations}
              selectedData={(selectedLocation: any) => setBinToLocationData(selectedLocation)}
            />
          </View>
          <View style={styles.inputSpinner}>
            <InputSpinner
              title="Quantity to Transfer"
              value={quantity}
              setValue={setQuantity}
            />
          </View>
        </View>
        <View style={styles.bottom}>
          <Button
            title="TRANSFER"
            style={{
              marginTop: 8
            }}
            disabled={binToLocationData && quantity <= 0}
            onPress={onTransfer}
          />
        </View>
      </View>
    </ScrollView>
  );
};

export default Transfer;
