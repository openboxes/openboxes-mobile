import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { Caption, Chip, Divider, Subheading, Text } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';

import showPopup from '../../components/Popup';
import { ScanErrorText } from '../../components/ScanErrorText';
import { ScannerInput } from '../../components/ScannerInput';
import { SearchButton } from '../../components/SearchButton';
import { useSearchButton } from '../../components/SearchButton/useSearchButton';
import { useScanField } from '../../hooks/useScanField';
import { lookupLocationByCodeAction } from '../../redux/actions/createTransfer';
import { setPutawayCandidateRemainingQuantity, submitPutawayItem } from '../../redux/actions/putaways';
import { RootState } from '../../redux/reducers';
import { putawayCandidateKey } from '../../utils/putawayCandidate';
import styles from './styles';

const PutawayItemDetail = () => {
  const route = useRoute();
  const dispatch = useDispatch();
  const navigation = useNavigation<any>();
  const [state, setState] = useState<any>({
    error: null,
    putAway: null,
    putAwayItem: null
  });
  const locationScan = useScanField();
  const isProcessing = useRef(false);
  const { productSummaryConfig } = useSelector((state: RootState) => state.settingsReducer);
  const { putAway, putAwayItem, candidateQuantity }: any = route.params;

  useEffect(() => {
    setState({
      ...state,
      putAway: putAway,
      putAwayItem: putAwayItem
    });
  }, []);

  const formSubmit = (scannedPutawayLocation: string) => {
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
          scannedPutawayLocation
        }
      ],
      orderedBy: '',
      sortBy: ''
    };

    const actionCallback = (data: any) => {
      isProcessing.current = false;
      if (data?.error) {
        locationScan.fail(data.errorMessage ?? 'Failed to submit details');
      } else {
        const putAwayQuantity = Number(state.putAwayItem?.quantity ?? 0);
        const remainingQuantity = Math.max(Number(candidateQuantity ?? putAwayQuantity) - putAwayQuantity, 0);
        dispatch(setPutawayCandidateRemainingQuantity(putawayCandidateKey(state.putAwayItem), remainingQuantity));

        locationScan.pass();
        navigation.navigate('PutawayCandidates');
      }
    };
    dispatch(submitPutawayItem(state.putAwayItem?.id as string, requestBody, actionCallback));
  };

  // The server accepts any unknown code when no putaway location is set, so the scan is checked here first.
  const handleLocationScan = (scannedLocation: string) => {
    if (isProcessing.current) {
      return;
    }

    const expectedLocationId = state.putAwayItem?.['putawayLocation.id'];
    const expectedLocationName = state.putAwayItem?.['putawayLocation.name'];
    if (!expectedLocationId) {
      locationScan.fail('No putaway location is assigned to this item. Go back and choose one.');
      return;
    }

    isProcessing.current = true;
    if (scannedLocation === expectedLocationName) {
      formSubmit(scannedLocation);
      return;
    }

    dispatch(
      lookupLocationByCodeAction(scannedLocation, (response: any) => {
        if (response?.data?.id === expectedLocationId) {
          formSubmit(scannedLocation);
          return;
        }
        isProcessing.current = false;
        locationScan.fail(`Incorrect location scanned (${scannedLocation}). Expected: ${expectedLocationName}.`);
      })
    );
  };

  const { isSearchOpen, searchButtonProps } = useSearchButton({ onSelect: locationScan.onChange });

  const showLotNumber = useMemo(() => productSummaryConfig?.lotNumber !== false, [productSummaryConfig]);
  const showExpirationDate = useMemo(() => productSummaryConfig?.expirationDate !== false, [productSummaryConfig]);

  return (
    <ScrollView keyboardShouldPersistTaps="always">
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
        <View style={styles.scannerRow}>
          <ScannerInput
            style={styles.scannerInput}
            label="Putaway Location Entry Field"
            placeholder={state.putAwayItem?.['putawayLocation.name'] ?? ''}
            value={locationScan.value}
            isEnabled={!isSearchOpen}
            danger={!!locationScan.error}
            onChange={locationScan.onChange}
            onSubmit={handleLocationScan}
          />
          <SearchButton searchType="destinationBin" {...searchButtonProps} />
        </View>
        <ScanErrorText message={locationScan.error} />
      </View>
    </ScrollView>
  );
};

export default PutawayItemDetail;
