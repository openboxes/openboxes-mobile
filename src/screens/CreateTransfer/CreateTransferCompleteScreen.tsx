import { RouteProp, useRoute } from '@react-navigation/native';
import React, { useMemo, useState } from 'react';
import { Alert, ScrollView, View } from 'react-native';
import { Caption, Divider, Text } from 'react-native-paper';
import { useDispatch } from 'react-redux';

import Button from '../../components/Button';
import { QuantityIcon } from '../../components/Icons';
import { resetToRoutes } from '../../NavigationService';
import { completeCreateTransferAction } from '../../redux/actions/createTransfer';
import { DetailChip } from '../../types/sortation';
import CreateTransferDetailsPanel from './CreateTransferDetailsPanel';
import styles from './styles';
import { CreateTransferStackParams } from './types';
import { formatLotExpiry } from './utils';

type CompleteRouteProp = RouteProp<CreateTransferStackParams, 'CreateTransferComplete'>;

type CompletionState = 'idle' | 'completing' | 'completed';

const renderQuantityIcon = () => <QuantityIcon size={16} color="#000" />;

export default function CreateTransferCompleteScreen() {
  const { params } = useRoute<CompleteRouteProp>();
  const { transferId, stockTransferNumber, item, quantity, destination } = params;
  const dispatch = useDispatch();

  const [completionState, setCompletionState] = useState<CompletionState>('idle');

  function handleComplete() {
    setCompletionState('completing');
    dispatch(
      completeCreateTransferAction(transferId, (response: any) => {
        if (response && !response.error) {
          setCompletionState('completed');
        } else {
          setCompletionState('idle');
          Alert.alert('Complete Transfer Failed', response?.errorMessage || 'Failed to complete transfer.');
        }
      })
    );
  }

  function handleNewTransfer() {
    resetToRoutes([{ name: 'Drawer', params: { screen: 'Dashboard' } }, { name: 'CreateTransferEntry' }]);
  }

  const detailsChips = useMemo<DetailChip[]>(
    () => [
      {
        icon: 'airplane-takeoff',
        label: 'From',
        value: item.originBinLocation.locationNumber || item.originBinLocation.name
      },
      {
        icon: 'airplane-landing',
        label: 'To',
        value: destination.locationNumber || destination.name,
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
    [
      item.originBinLocation.locationNumber,
      item.originBinLocation.name,
      destination.locationNumber,
      destination.name,
      item.lotNumber,
      item.expirationDate,
      quantity
    ]
  );

  const isCompleting = completionState === 'completing';
  const isCompleted = completionState === 'completed';

  return (
    <View style={styles.screenRoot}>
      <ScrollView keyboardShouldPersistTaps="always" style={styles.scrollContent}>
        <CreateTransferDetailsPanel
          productCode={item.product.productCode}
          productName={item.product.name}
          detailsChips={detailsChips}
        />

        <Divider />
      </ScrollView>

      <View style={styles.footerContainer}>
        {isCompleted && (
          <View style={styles.refBand}>
            <Caption style={styles.refLabel}>Reference Number</Caption>
            <Text style={styles.refValue}>{stockTransferNumber}</Text>
          </View>
        )}

        {isCompleted ? (
          <Button title="New Transfer" mode="contained" size="100%" onPress={handleNewTransfer} />
        ) : (
          <Button
            title={isCompleting ? 'Completing...' : 'Complete Transfer'}
            mode="contained"
            size="100%"
            disabled={isCompleting}
            onPress={handleComplete}
          />
        )}
      </View>
    </View>
  );
}
