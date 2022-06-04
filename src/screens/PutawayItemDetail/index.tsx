import React, { useEffect, useState } from 'react';
import { View, ScrollView } from 'react-native';
import styles from './styles';
import showPopup from '../../components/Popup';
import { useNavigation, useRoute } from '@react-navigation/native';
import InputBox from '../../components/InputBox';
import { useDispatch } from 'react-redux';
import { submitPutawayItem } from '../../redux/actions/putaways';
import Button from '../../components/Button';
import LabledData from "../../components/LabeledData";

const PutawayItemDetail = () => {
  const route = useRoute();
  const dispatch = useDispatch();
  const navigation = useNavigation<any>();
  const [state, setState] = useState<any>({
    error: null,
    putAway: null,
    putAwayItem: null,
    scannedPutawayLocation: '',
  });
  const {putAway, putAwayItem}: any = route.params;

  useEffect(() => {
    setState({
      ...state,
      putAway: putAway,
      putAwayItem: putAwayItem,
    });
  }, []);

  const formSubmit = () => {
    let errorTitle = '';
    let errorMessage = '';
    if (errorTitle !== '') {
      showPopup({
        title: errorTitle,
        message: errorMessage,
        negativeButtonText: 'Cancel',
      });
      return Promise.resolve(null);
    }

    const requestBody = {
      id: state.putAway?.id,
      putawayNumber: state.putAway?.putawayNumber,
      putawayStatus: 'COMPLETED',
      putawayDate: state.putAway?.putawayDate ?? '',
      putawayAssignee: '',
      'origin.id': state.putAway?.['origin.id'],
      'destination.id': state.putAway?.['destination.id'],
      putawayItems: [
        {
          id: state.putAwayItem?.id,
          putawayStatus: 'COMPLETED',
          'currentFacility.id': state.putAwayItem?.['currentFacility.id'],
          'currentLocation.id': state.putAwayItem?.['currentLocation.id'],
          'product.id': state.putAwayItem?.['product.id'],
          'inventoryItem.id': state.putAwayItem?.['inventoryItem.id'],
          'putawayFacility.id': state.putAwayItem?.['putawayFacility.id'],
          'putawayLocation.id': state.putAwayItem?.['putawayLocation.id'] || "",
          quantity: state.putAwayItem?.quantity,
          scannedPutawayLocation: state.scannedPutawayLocation,
        },
      ],
      'orderedBy.id': '',
      sortBy: '',
    };

    const actionCallback = (data: any) => {
      if (data?.error) {
        showPopup({
          title: data.errorMessage ? 'Failed to submit' : "Error",
          message: data.errorMessage ?? 'Failed to submit details',
          positiveButton: {
            text: 'Retry',
            callback: () => {
              dispatch(
                submitPutawayItem(
                  state.putAwayItem?.id as string,
                  requestBody,
                  actionCallback,
                ),
              );
            },
          },
          negativeButtonText: 'Cancel',
        });
      } else {
        showPopup({
          title: ' Success',
          message: 'Putaway was successfully submited',
          positiveButton: {
            text: 'ok',
            callback: () => {
              navigation.navigate('Dashboard');
            },
          },
        });
      }
    };
    dispatch(
      submitPutawayItem(
        state.putAwayItem?.id as string,
        requestBody,
        actionCallback,
      ),
    );
  };

  const onChangeScannedPutawayLocation = (text: string) => {
    setState({...state, scannedPutawayLocation: text});
  };

  return (
    <ScrollView>
      <View style={styles.contentContainer}>
        <View style={styles.rowItem}>
          <LabledData label="Putaway Identifier" data={state.putAway?.putawayNumber} />
          <LabledData label="Quantity to Putaway" data={state.putAwayItem?.quantity.toString()} />
        </View>
        <View style={styles.rowItem}>
          <LabledData label="Product Code" data={state.putAwayItem?.['product.productCode']} />
          <LabledData label="Product Name" data={state.putAwayItem?.['product.name']} />
        </View>
        <View style={styles.rowItem}>
          <LabledData label="Lot Number" data={state.putAwayItem?.['inventoryItem.lotNumber']} defaultValue='Default' />
          <LabledData label="Expiry Date" data={state.putAwayItem?.['inventoryItem.expiryDate']} defaultValue='Never' />
        </View>
        <View style={styles.rowItem}>
          <LabledData label="Current Location" data={state.putAwayItem?.['currentLocation.name']} defaultValue="Default"/>
          <LabledData label="Putaway Location" data={state.putAwayItem?.['putawayLocation.name']} defaultValue="Default"/>
        </View>
      </View>
      <View style={styles.contentContainer}>
        <View style={styles.from}>
          <InputBox
            label={'Scan Putaway Location'}
            value={state.scannedPutawayLocation}
            onChange={onChangeScannedPutawayLocation}
            editable={false}
            disabled={false}
          />
        </View>
      </View>
      <Button
        title="Confirm Putaway"
        style={styles.buttonContainer}
        onPress={formSubmit}
        disabled={false}
      />
    </ScrollView>
  );
};

export default PutawayItemDetail;
