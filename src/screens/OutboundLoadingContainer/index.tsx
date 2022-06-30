import React, { useState } from 'react';
import { Alert, ScrollView, ToastAndroid, View } from 'react-native';
import { useDispatch } from 'react-redux';
import styles from '../OutboundStockDetails/styles';
import { updateContainerStatus } from '../../redux/actions/lpn';
import OrderDetailsSection from '../OutboundLoadingDetails/OrderDetailsSection';
import InputBox from '../../components/InputBox';
import showPopup from '../../components/Popup';
import { useNavigation, useRoute } from '@react-navigation/native';
import TICK from '../../assets/images/tick.png';
import SCAN from '../../assets/images/scan.jpg';
import CLEAR from '../../assets/images/icon_clear.png';
import Button from '../../components/Button';

// LPN loading
const OutboundLoadingContainer = () => {
  const dispatch = useDispatch();
  const route = useRoute();
  const { container, scanned, shipment }: any = route.params;
  const navigation = useNavigation<any>();

  const [scannedLPN, setScannedLPN] = useState<string>(scanned ? (container?.containerNumber ?? '') : '');
  const [scannedLoadingLocation, setScannedLoadingLocation] = useState<string>('');

  const getIcon = (property: string, scannedValue: string) => {
    if (!property || (property && property === scannedValue)) {
      return TICK;
    }

    if (!scannedValue) {
      return SCAN;
    }

    return CLEAR;
  };

  const isPropertyValid = (property: string, scannedValue: string) => {
    if (!property && !scannedValue) {
      return true;
    }

    return property === scannedValue;
  };

  const loadContainer = () => {
    try {
      let errorTitle = '';
      let errorMessage = '';

      const scannedLPNValid = isPropertyValid(container?.containerNumber, scannedLPN);
      const scannedLoadingLocationValid = isPropertyValid(
        shipment?.loadingStatusDetails?.loadingLocation?.locationNumber, scannedLoadingLocation,
      );

      if (!scannedLPNValid) {
        errorTitle = 'LPN Container Number is invalid';
        errorMessage = 'Scan proper LPN Container Number';
      }

      if (!scannedLoadingLocationValid) {
        errorTitle = 'Loading Location is invalid';
        errorMessage = 'Scanned Loading Location is not for this load';
      }

      if (errorTitle != '') {
        showPopup({
          title: errorTitle,
          message: errorMessage,
        });
        return Promise.resolve(null);
      }

      const actionCallback = (data: any) => {
        if (data && data.error) {
          showPopup({
            title: data.errorMessage ? 'Failed to load container' : null,
            message: data.errorMessage || 'Failed to load container',
          });
        } else {
          ToastAndroid.show('Loaded container successfully!', ToastAndroid.SHORT);
          console.log(shipment?.loadedContainerCount);
          const totalContainersLoaded = shipment?.loadedContainerCount + 1;
          if (totalContainersLoaded >= shipment?.totalContainerCount) {
            Alert.alert(
              'All containers are loaded', // title
              'What do you want to do now?', // message
              [{ // button list
                text: 'Go to the details',
                onPress: () =>
                  navigation.navigate('OutboundLoadingDetails', {
                    shipmentId: shipment?.id,
                    refetchShipment: true
                  })
              },
              {
                text: 'Go to the loading list',
                onPress: () => navigation.navigate('OutboundLoadingList')
              }],
              {
                cancelable: false
              },
            );
          } else {
            navigation.navigate('OutboundLoadingDetails', {
              shipmentId: shipment?.id,
              refetchShipment: true
            })
          }
        }
      };

      dispatch(
        updateContainerStatus(
          container?.id as string,
          'LOADED',
          actionCallback,
        )
      );
    } catch (e) {
      const title = e.message ? 'Failed load container' : null;
      const message = e.message  || 'Failed load container';
      showPopup({
        title: title,
        message: message,
        negativeButtonText: 'Cancel',
      });
      return Promise.resolve(null);
    }
  };

  return (
    <ScrollView style={styles.screenContainer}>
      <View style={styles.contentContainer}>
        <OrderDetailsSection shipment={shipment} />
        <View>
          <InputBox
            value={scannedLPN}
            placeholder={container?.containerNumber || 'LPN\'s Container Number'}
            label={container?.containerNumber || 'LPN\'s Container Number'}
            disabled={false}
            onEndEdit={(value: any) => setScannedLPN(value)}
            onChange={(value: any) => setScannedLPN(value)}
            editable
            icon={getIcon(container?.containerNumber, scannedLPN)}
            onIconClick={() => {
              if (scannedLPN && !isPropertyValid(container?.containerNumber, scannedLPN)) {
                setScannedLPN('')
                return;
              }
              showPopup({
                message: `Scan LPN's container number. Expected: ${container?.containerNumber || 'DEFAULT (empty)'}.\n\nTo validate LPN's container number click on this field and scan LPN's container number.`,
                positiveButton: {
                  text: 'Ok',
                },
              })
            }}
          />
        </View>
        <InputBox
          value={scannedLoadingLocation}
          placeholder={shipment?.loadingStatusDetails?.loadingLocation?.locationNumber || 'Loading Location'}
          label={shipment?.loadingStatusDetails?.loadingLocation?.locationNumber || 'Loading Location'}
          disabled={false}
          onEndEdit={(value: any) => setScannedLoadingLocation(value)}
          onChange={(value: any) => setScannedLoadingLocation(value)}
          editable
          icon={getIcon(shipment?.loadingStatusDetails?.loadingLocation?.locationNumber, scannedLoadingLocation)}
          onIconClick={() => {
            if (scannedLoadingLocation && !isPropertyValid(
              shipment?.loadingStatusDetails?.loadingLocation?.locationNumber, scannedLoadingLocation
            )) {
              setScannedLoadingLocation('')
              return;
            }
            showPopup({
              message: `Scan Loading Location Number. Expected: ${shipment?.loadingStatusDetails?.loadingLocation?.locationNumber || 'DEFAULT (empty)'}.\n\nTo validate Loading Location Number click on this field and scan Loading Location Number.`,
              positiveButton: {
                text: 'Ok',
              },
            })
          }}
        />
        <Button title="Load Container" onPress={() => loadContainer()} disabled={false} />
      </View>
    </ScrollView>
  )
}

export default OutboundLoadingContainer;
