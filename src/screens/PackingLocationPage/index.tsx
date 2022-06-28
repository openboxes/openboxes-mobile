import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styles from './styles';
import {ScrollView, Text, ToastAndroid, View} from 'react-native';
import Button from '../../components/Button';
import showPopup from '../../components/Popup';
import { useNavigation, useRoute } from '@react-navigation/native';
import { submitPackingLocation } from '../../redux/actions/orders';
import { searchInternalLocations } from '../../redux/actions/locations';
import { RootState } from '../../redux/reducers';
import AsyncModalSelect from '../../components/AsyncModalSelect';
import InputBox from "../../components/InputBox";
import TICK from "../../assets/images/tick.png";
import SCAN from "../../assets/images/scan.jpg";
import CLEAR from "../../assets/images/icon_clear.png";

const PackingLocationPage = () => {
  const dispatch = useDispatch();
  const route = useRoute();
  const { orderId, packingLocation }: any = route.params;
  const navigation = useNavigation<any>();
  const location = useSelector((state: RootState) => state.mainReducer.currentLocation);
  const [internalLocations, setInternalLocations] = useState<any>([]);

  const [scannedPackingLocation, setScannedPackingLocation] = useState<any>('');

  useEffect(() => {
    getInternalLocation(location.id);
  }, [location]);

  const validateAndSubmitPackingLocation = () => {
    let errorTitle = '';
    let errorMessage = '';

    if (packingLocation && packingLocation?.locationNumber !== scannedPackingLocation) {
      errorTitle = 'Invalid packing location!';
      errorMessage = `Please scan proper packing location. Required: ${packingLocation?.locationNumber}.`;
    }

    if (!packingLocation && !scannedPackingLocation) {
      errorTitle = 'Missing packing location!';
      errorMessage = `Please select proper packing location.`;
    }

    if (errorTitle !== '') {
      showPopup({
        title: errorTitle,
        message: errorMessage,
      });
      return Promise.resolve(null);
    }

    const payload = {
      'packingLocation.id': packingLocation ? packingLocation.id : scannedPackingLocation.id,
    };

    const submitCallback = (data: any) => {
      if (data?.error) {
        showPopup({
          title: data.message ?? 'Request failed.',
          message: data.errorMessage ?? `Failed to submit packing location`,
          positiveButton: {
            text: 'Retry',
            callback: () => {
              dispatch(submitPackingLocation(orderId, payload, submitCallback));
            }
          },
          negativeButtonText: 'Cancel'
        });
      } else {
        ToastAndroid.show('Packing location submitted successfully!', ToastAndroid.SHORT);
        navigation.navigate('Orders', { refetchOrders: true });
      }
    };

    dispatch(submitPackingLocation(orderId, payload, submitCallback));
  };


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
        let locationList: any[] = [];
        if (data && Object.keys(data).length !== 0) {
          data.data.map((item: any) => {
            const locationData = {
              name: item.name,
              id: item.id
            };
            locationList.push(locationData);
          });
        }
        setInternalLocations(locationList);
      }
    };
    dispatch(
      searchInternalLocations(
        '',
        {
          'parentLocation.id': location.id,
          max: 25,
          offset: 0,
          activityCode: 'PACK_STOCK',
        },
        callback
      )
    );
  };

  const getIcon = (scannedValue: string) => {
    if (packingLocation && packingLocation?.locationNumber === scannedValue) {
      return TICK;
    }

    if (!scannedPackingLocation) {
      return SCAN;
    }

    return CLEAR;
  }

  return (
    <ScrollView keyboardShouldPersistTaps="always" style={styles.container}>
      <View style={styles.from}>
        {packingLocation && (
          <View>
            <Text>Packing location name: {packingLocation?.name}</Text>
            <Text>Scan packing location number to validate:</Text>
            <InputBox
              value={scannedPackingLocation}
              placeholder={packingLocation?.locationNumber || packingLocation?.id}
              label={packingLocation?.locationNumber || 'Packing Location'}
              disabled={false}
              onEndEdit={(value: any) => setScannedPackingLocation(value)}
              onChange={(value: any) => setScannedPackingLocation(value)}
              editable
              icon={getIcon(scannedPackingLocation)}
              onIconClick={() => {
                if (scannedPackingLocation && scannedPackingLocation !== packingLocation?.locationNumber) {
                  setScannedPackingLocation('');
                  return;
                }
                showPopup({
                  message: `Scan packing location. Expected: ${packingLocation?.locationNumber}.\n\nTo validate packing location click on this field and scan packing location.`,
                  positiveButton: {
                    text: 'Ok',
                  },
                })
              }}
            />
          </View>
        )}
        {!packingLocation && (
          <View>
            <Text>No packing location assigned. Select packing location:</Text>
            <AsyncModalSelect
              placeholder="Packing Location"
              label="Packing Location"
              initValue={packingLocation || ''}
              initialData={internalLocations}
              searchAction={searchInternalLocations}
              searchActionParams={{
                'parentLocation.id': location.id,
                activityCode: 'PACK_STOCK',
              }}
              onSelect={(selectedItem: any) => {
                if (selectedItem) {
                  setScannedPackingLocation(selectedItem);
                }
              }}
            />
          </View>
        )}

        <View style={styles.bottom}>
          <Button title="Submit Packing Location" disabled={false} onPress={validateAndSubmitPackingLocation} />
        </View>
      </View>
    </ScrollView>
  );
};

export default PackingLocationPage;
