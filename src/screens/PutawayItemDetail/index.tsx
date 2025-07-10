import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useEffect, useMemo, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { Caption, Chip, Divider, Subheading, Text } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';

import Button from '../../components/Button';
import InputBox from '../../components/InputBox';
import showPopup from '../../components/Popup';
import { submitPutawayItem } from '../../redux/actions/putaways';
import { RootState } from '../../redux/reducers';
import styles from './styles';

const PutawayItemDetail = () => {
  const route = useRoute();
  const dispatch = useDispatch();
  const navigation = useNavigation<any>();
  const [state, setState] = useState<any>({
    error: null,
    putAway: null,
    putAwayItem: null,
    scannedPutawayLocation: ''
  });
  const { productSummaryConfig } = useSelector((state: RootState) => state.settingsReducer);
  const { putAway, putAwayItem }: any = route.params;

  useEffect(() => {
    setState({
      ...state,
      putAway: putAway,
      putAwayItem: putAwayItem
    });
  }, []);

  const formSubmit = () => {
    let errorTitle = '';
    let errorMessage = '';
    if (errorTitle !== '') {
      showPopup({
        title: errorTitle,
        message: errorMessage,
        negativeButtonText: 'Cancel'
      });
      return Promise.resolve(null);
    }

    const requestBody = {
      id: state.putAway?.id,
      putawayNumber: state.putAway?.putawayNumber,
      putawayStatus: 'COMPLETED',
      putawayDate: state.putAway?.putawayDate ?? '',
      putawayAssignee: '',
      origin: state.putAway?.['origin.id'],
      destination: state.putAway?.['destination.id'],
      putawayItems: [
        {
          id: state.putAwayItem?.id,
          putawayStatus: 'COMPLETED',
          currentFacility: state.putAwayItem?.['currentFacility.id'],
          currentLocation: state.putAwayItem?.['currentLocation.id'],
          product: state.putAwayItem?.['product.id'],
          inventoryItem: state.putAwayItem?.['inventoryItem.id'],
          putawayFacility: state.putAwayItem?.['putawayFacility.id'],
          putawayLocation: state.putAwayItem?.['putawayLocation.id'] || '',
          quantity: state.putAwayItem?.quantity,
          scannedPutawayLocation: state.scannedPutawayLocation
        }
      ],
      orderedBy: '',
      sortBy: ''
    };

    const actionCallback = (data: any) => {
      if (data?.error) {
        showPopup({
          title: data.errorMessage ? 'Failed to submit' : 'Error',
          message: data.errorMessage ?? 'Failed to submit details',
          positiveButton: {
            text: 'Retry',
            callback: () => {
              dispatch(submitPutawayItem(state.putAwayItem?.id as string, requestBody, actionCallback));
            }
          },
          negativeButtonText: 'Cancel'
        });
      } else {
        showPopup({
          title: ' Success',
          message: 'Putaway was successfully submited',
          positiveButton: {
            text: 'ok',
            callback: () => {
              navigation.navigate('PutawayCandidates');
            }
          }
        });
      }
    };
    dispatch(submitPutawayItem(state.putAwayItem?.id as string, requestBody, actionCallback));
  };

  const onChangeScannedPutawayLocation = (text: string) => {
    setState({ ...state, scannedPutawayLocation: text });
  };

  const showLotNumber = useMemo(() => productSummaryConfig?.lotNumber !== false, [productSummaryConfig]);
  const showExpirationDate = useMemo(() => productSummaryConfig?.expirationDate !== false, [productSummaryConfig]);

  return (
    <ScrollView>
      <View style={styles.dataContainer}>
        <View style={styles.headerRow}>
          <Chip icon="identifier" style={styles.chipDefault} textStyle={styles.chipWarningText}>
            {state.putAway?.putawayNumber}
          </Chip>
          {showExpirationDate && (
            <Chip icon="calendar" style={[styles.chipDefault, styles.lastChild]} textStyle={styles.chipWarningText}>
              {`Expiry Date: ${state.putAwayItem?.['inventoryItem.expirationDate'] || 'Never'}`}
            </Chip>
          )}
        </View>
        <Divider style={styles.dividerHorizontal} />

        <Subheading style={{ fontWeight: 'bold' }}>
          {`${state.putAwayItem?.['product.productCode']} - ${state.putAwayItem?.['product.name']}`}
        </Subheading>
        {showLotNumber && (
          <Caption> {`Lot Number: ${state.putAwayItem?.['inventoryItem.lotNumber'] || 'Default'}`} </Caption>
        )}

        <View style={styles.rowItem}>
          <Chip icon="package" style={styles.chipDefault} textStyle={styles.chipWarningText}>
            {`Quantity To Putaway: ${state.putAwayItem?.quantity.toString()}`}
          </Chip>
        </View>
        <Divider style={styles.dividerHorizontal} />

        <View style={styles.additionalInfoRow}>
          <View style={styles.columnItem}>
            <Text style={styles.label}>Current Location</Text>
            <Text style={styles.value}>{state.putAwayItem?.['currentLocation.name'] || 'Default'}</Text>
          </View>
          <View style={styles.columnItem}>
            <Text style={styles.label}>Putaway Location</Text>
            <Text style={styles.value}>{state.putAwayItem?.['putawayLocation.name'] || 'Default'}</Text>
          </View>
        </View>
      </View>
      <Divider />
      <View style={styles.contentContainer}>
        <Text style={styles.scanPutawayLabel}>Scan Putaway Location</Text>
        <InputBox
          placeholder="Default"
          label="Default"
          value={state.scannedPutawayLocation}
          onChange={onChangeScannedPutawayLocation}
          editable={false}
          disabled={false}
        />
        <Button
          size="100%"
          title="Confirm Putaway"
          style={styles.buttonContainer}
          onPress={formSubmit}
          disabled={false}
        />
      </View>
    </ScrollView>
  );
};

export default PutawayItemDetail;
