import { useNavigation, useRoute } from '@react-navigation/native';
import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import { ScrollView, Text, ToastAndroid, View } from 'react-native';
import { Caption, Chip, Divider, Subheading } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';

import AsyncModalSelect from '../../components/AsyncModalSelect';
import Button from '../../components/Button';
import InputSpinner from '../../components/InputSpinner';
import showPopup from '../../components/Popup';
import { HYPHEN } from '../../constants';
import { searchInternalLocations } from '../../redux/actions/locations';
import { updateStockTransfer } from '../../redux/actions/transfers';
import { RootState } from '../../redux/reducers';
import Theme from '../../utils/Theme';
import styles from './styles';
import { hideScreenLoading } from '../../redux/actions/main';

const Transfer = () => {
  const route = useRoute();
  const navigation = useNavigation<any>();
  const { item }: any = route.params;
  const dispatch = useDispatch();
  const location = useSelector((rootState: RootState) => rootState.mainReducer.currentLocation);
  const [binToLocationData, setBinToLocationData] = useState<any>({});
  const [quantity, setQuantity] = useState(item?.quantityAvailable ?? 0);
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
          product: { id: item.product.id },
          inventoryItem: { id: item['inventoryItem.id'] },
          location: { id: location.id },
          originBinLocation: { id: item?.binLocation?.id },
          destinationBinLocation: { id: binToLocationData.id },
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
        const product = { id: item.product.productCode };
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
    <ScrollView>
      <View style={styles.infoContainer}>
        <View style={styles.headerRow}>
          <Chip icon="pin" style={styles.chipDefault} textStyle={styles.chipText}>
            {`Bin Location (From): ${item?.binLocation?.name ?? 'Default'}`}
          </Chip>
          <Chip icon="calendar" style={styles.chipDefault} textStyle={styles.chipText}>
            {`Expiry Date: ${item?.expirationDate ?? 'Never'}`}
          </Chip>
        </View>
        <Divider style={{ marginVertical: Theme.spacing.medium }} />

        <Subheading style={styles.subheading}>{`${item?.product.productCode} - ${item?.product.name}`}</Subheading>
        <Caption style={styles.caption}>{`Lot Number: ${item?.lotNumber ?? 'Default'}`}</Caption>

        <View style={styles.additionalInfoRow}>
          <Chip icon="package" style={styles.chipDefault} textStyle={styles.chipText}>
            {`Quantity Available To Transfer: ${item.quantityAvailable ?? HYPHEN}`}
          </Chip>
        </View>
      </View>
      <Divider />

      <View style={styles.formContainer}>
        <View>
          <Text>Bin Location (Destination)</Text>
          <AsyncModalSelect
            placeholder="Bin Location (Destination)"
            label="Bin Location (Destination)"
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
        <InputSpinner title="Quantity to Transfer" value={quantity} setValue={setQuantity} />
        <Button
          style={styles.button}
          size="100%"
          title="TRANSFER"
          disabled={binToLocationData && quantity <= 0}
          onPress={onTransfer}
        />
      </View>
    </ScrollView>
  );
};

export default Transfer;
