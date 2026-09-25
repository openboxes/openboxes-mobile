import { RouteProp, useRoute } from '@react-navigation/native';
import React, { useCallback, useMemo, useRef } from 'react';
import { Alert, ScrollView, View } from 'react-native';
import { Divider } from 'react-native-paper';
import { useDispatch } from 'react-redux';

import { LocationIcon, QuantityIcon } from '../../components/Icons';
import { ScanErrorText } from '../../components/ScanErrorText';
import { ScannerInput } from '../../components/ScannerInput';
import { SearchButton } from '../../components/SearchButton';
import { useSearchButton } from '../../components/SearchButton/useSearchButton';
import { EMPTY_STRING } from '../../constants';
import { useScanField } from '../../hooks/useScanField';
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

  const destinationScan = useScanField();
  const { pass, fail, setValue } = destinationScan;
  const isProcessing = useRef(false);

  const failDestination = useCallback(
    (message: string) => {
      isProcessing.current = false;
      fail(message);
    },
    [fail]
  );

  const submitTransfer = useCallback(
    (destination: DestinationBin) => {
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
          if (response && !response.error && response.data) {
            const created = response.data;
            isProcessing.current = false;
            pass();
            replace('CreateTransferComplete', {
              transferId: created.id,
              stockTransferNumber: created.stockTransferNumber || created.id,
              item,
              quantity,
              destination
            });
          } else {
            isProcessing.current = false;
            setValue(EMPTY_STRING);
            Alert.alert('Transfer Failed', response?.errorMessage || 'An error occurred while creating the transfer.');
          }
        })
      );
    },
    [dispatch, item, quantity, pass, setValue]
  );

  const resolveDestination = useCallback(
    (code: string) => {
      if (!code || code.trim() === '' || isProcessing.current) {
        return;
      }
      isProcessing.current = true;
      dispatch(
        lookupLocationByCodeAction(code.trim(), (resp: any) => {
          if (resp && !resp.error && resp.data) {
            const loc = resp.data;
            if (loc.id === item.originBinLocation.id) {
              failDestination('Destination cannot be the same as source bin.');
              return;
            }
            submitTransfer({
              id: loc.id,
              name: loc.name,
              locationNumber: loc.locationNumber
            });
          } else {
            failDestination(`Bin not found (${code.trim()}).`);
          }
        })
      );
    },
    [dispatch, item.originBinLocation.id, failDestination, submitTransfer]
  );

  const { isSearchOpen, searchButtonProps } = useSearchButton({ onSelect: destinationScan.onChange });

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
              value={destinationScan.value}
              isEnabled={!isSearchOpen}
              danger={!!destinationScan.error}
              onChange={destinationScan.onChange}
              onSubmit={resolveDestination}
            />
            <SearchButton searchType="destinationBin" {...searchButtonProps} />
          </View>

          <ScanErrorText message={destinationScan.error} />
        </View>
      </ScrollView>
    </View>
  );
}
