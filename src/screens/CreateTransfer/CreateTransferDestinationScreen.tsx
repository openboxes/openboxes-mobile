import { RouteProp, useRoute } from '@react-navigation/native';
import React, { useCallback, useMemo, useState } from 'react';
import { Alert, ScrollView, View } from 'react-native';
import { Divider, Text } from 'react-native-paper';
import { useDispatch } from 'react-redux';

import Button from '../../components/Button';
import { LocationIcon, QuantityIcon } from '../../components/Icons';
import { ScannerInput } from '../../components/ScannerInput';
import { SearchButton } from '../../components/SearchButton';
import { useSearchButton } from '../../components/SearchButton/useSearchButton';
import { EMPTY_STRING } from '../../constants';
import { replace } from '../../NavigationService';
import { lookupLocationByCodeAction, submitCreateTransferAction } from '../../redux/actions/createTransfer';
import { DetailChip } from '../../types/sortation';
import CreateTransferDetailsPanel from './CreateTransferDetailsPanel';
import styles from './styles';
import { CreateTransferStackParams, DestinationBin, StockTransferPayload } from './types';
import { formatLotExpiry, STOCK_TRANSFER_STATUS } from './utils';

type DestinationRouteProp = RouteProp<CreateTransferStackParams, 'CreateTransferDestination'>;

const renderQuantityIcon = () => <QuantityIcon size={16} color="#000" />;

export default function CreateTransferDestinationScreen() {
  const { params } = useRoute<DestinationRouteProp>();
  const { item, quantity } = params;
  const dispatch = useDispatch();

  const [destinationCode, setDestinationCode] = useState<string>(EMPTY_STRING);
  const [destination, setDestination] = useState<DestinationBin | null>(null);
  const [destinationError, setDestinationError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleDestinationChange = useCallback((next: string) => {
    setDestinationCode(next);
    // Editing invalidates any previously resolved destination.
    setDestination(null);
    setDestinationError(null);
  }, []);

  const resolveDestination = useCallback(
    (code: string) => {
      if (!code || code.trim() === '') {
        setDestination(null);
        setDestinationError(null);
        return;
      }
      setDestinationError(null);
      dispatch(
        lookupLocationByCodeAction(code.trim(), (resp: any) => {
          if (resp && !resp.error && resp.data) {
            const loc = resp.data;
            if (loc.id === item.originBinLocation.id) {
              setDestination(null);
              setDestinationError('Destination cannot be the same as source bin.');
              return;
            }
            setDestination({
              id: loc.id,
              name: loc.name,
              locationNumber: loc.locationNumber
            });
            setDestinationError(null);
          } else {
            setDestination(null);
            setDestinationError('Bin not found.');
          }
        })
      );
    },
    [dispatch, item.originBinLocation.id]
  );

  const handleModalSelect = useCallback(
    (code: string) => {
      setDestinationCode(code);
      resolveDestination(code);
    },
    [resolveDestination]
  );

  const { isSearchOpen, searchButtonProps } = useSearchButton({ onSelect: handleModalSelect });

  function handleSubmit() {
    if (!destination) {
      return;
    }

    setIsSubmitting(true);

    const payload: StockTransferPayload = {
      stockTransferItems: [
        {
          id: null,
          productAvailabilityId: item.productAvailabilityId,
          product: { id: item.product.id },
          inventoryItem: { id: item.inventoryItemId },
          originBinLocation: { id: item.originBinLocation.id },
          destinationBinLocation: { id: destination.id },
          quantity,
          quantityOnHand: item.quantityOnHand,
          quantityNotPicked: item.quantityNotPicked,
          status: STOCK_TRANSFER_STATUS.PENDING,
          splitItems: [],
          sortOrder: 0
        }
      ]
    };

    dispatch(
      submitCreateTransferAction(payload, (response: any) => {
        setIsSubmitting(false);
        if (response && !response.error && response.data) {
          const created = response.data;
          replace('CreateTransferComplete', {
            transferId: created.id,
            stockTransferNumber: created.stockTransferNumber || created.id,
            item,
            quantity,
            destination
          });
        } else {
          Alert.alert('Transfer Failed', response?.errorMessage || 'An error occurred while creating the transfer.');
        }
      })
    );
  }

  const detailsChips = useMemo<DetailChip[]>(
    () => [
      {
        icon: 'airplane-takeoff',
        label: 'From',
        value: item.originBinLocation.locationNumber || item.originBinLocation.name,
        isActive: true
      },
      {
        icon: 'tag',
        label: 'Lot',
        value: formatLotExpiry(item.lotNumber, item.expirationDate)
      },
      {
        icon: renderQuantityIcon,
        label: 'Quantity',
        value: quantity
      }
    ],
    [item.originBinLocation.locationNumber, item.originBinLocation.name, item.lotNumber, item.expirationDate, quantity]
  );

  const transferEnabled = !isSubmitting && !!destination;

  return (
    <View style={styles.screenRoot}>
      <ScrollView keyboardShouldPersistTaps="always" style={styles.scrollContent}>
        <CreateTransferDetailsPanel
          productCode={item.product.productCode}
          productName={item.product.name}
          detailsChips={detailsChips}
        />

        <Divider />

        <View style={styles.formContainer}>
          <View style={styles.scannerRow}>
            <ScannerInput
              style={styles.scannerInput}
              label="Destination"
              placeholder="Scan or select destination bin"
              leftIcon={<LocationIcon size={24} />}
              value={destinationCode}
              isEnabled={!isSearchOpen}
              danger={!!destinationError}
              onChange={handleDestinationChange}
              onSubmit={resolveDestination}
            />
            <SearchButton searchType="destinationBin" {...searchButtonProps} />
          </View>

          {destinationError ? <Text style={styles.errorText}>{destinationError}</Text> : null}
        </View>
      </ScrollView>

      <View style={styles.footerContainer}>
        <Button
          title={isSubmitting ? 'Submitting...' : 'Transfer'}
          mode="contained"
          size="100%"
          disabled={!transferEnabled}
          onPress={handleSubmit}
        />
      </View>
    </View>
  );
}
