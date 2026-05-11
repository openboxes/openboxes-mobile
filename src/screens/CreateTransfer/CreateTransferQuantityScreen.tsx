import { RouteProp, useRoute } from '@react-navigation/native';
import React, { useMemo, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { Divider, Text } from 'react-native-paper';

import Button from '../../components/Button';
import { QuantityIcon } from '../../components/Icons';
import { ScannerInput } from '../../components/ScannerInput';
import { EMPTY_STRING } from '../../constants';
import { navigate } from '../../NavigationService';
import { DetailChip } from '../../types/sortation';
import CreateTransferDetailsPanel from './CreateTransferDetailsPanel';
import styles from './styles';
import { CreateTransferStackParams } from './types';
import { formatLotExpiry } from './utils';

type QuantityRouteProp = RouteProp<CreateTransferStackParams, 'CreateTransferQuantity'>;

const renderQuantityIcon = () => <QuantityIcon size={16} color="#000" />;

export default function CreateTransferQuantityScreen() {
  const { params } = useRoute<QuantityRouteProp>();
  const { item } = params;

  const [quantity, setQuantity] = useState<number | undefined>(undefined);
  const [quantityError, setQuantityError] = useState<string | null>(null);

  function handleQuantityChange(text: string) {
    const digits = text.replace(/[^0-9]/g, '');
    setQuantity(digits.length > 0 ? parseInt(digits, 10) : undefined);
    if (quantityError) {
      setQuantityError(null);
    }
  }

  function handleConfirm() {
    if (!quantity || quantity <= 0) {
      setQuantityError('Please enter a quantity greater than zero.');
      return;
    }
    if (quantity > item.quantityNotPicked) {
      setQuantityError(`Quantity cannot exceed available (${item.quantityNotPicked}).`);
      return;
    }
    setQuantityError(null);
    navigate('CreateTransferDestination', { item, quantity });
  }

  const detailsChips = useMemo<DetailChip[]>(
    () => [
      {
        icon: 'airplane-takeoff',
        label: 'From',
        value: item.originBinLocation.locationNumber || item.originBinLocation.name
      },
      {
        icon: 'tag',
        label: 'Lot',
        value: formatLotExpiry(item.lotNumber, item.expirationDate)
      },
      {
        icon: renderQuantityIcon,
        label: 'Available',
        value: item.quantityNotPicked,
        isActive: true
      }
    ],
    [
      item.originBinLocation.locationNumber,
      item.originBinLocation.name,
      item.lotNumber,
      item.expirationDate,
      item.quantityNotPicked
    ]
  );

  const canConfirm = !!quantity && quantity > 0 && quantity <= item.quantityNotPicked;

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
          <ScannerInput
            showKeyboardOnMount
            autoSubmitTimeout={0}
            leftIcon={<QuantityIcon size={24} />}
            placeholder={`Max ${item.quantityNotPicked}`}
            keyboardType="number-pad"
            label="Quantity"
            value={quantity?.toString() ?? EMPTY_STRING}
            danger={!!quantityError}
            onChange={handleQuantityChange}
            onSubmit={handleConfirm}
          />
          {quantityError ? <Text style={styles.errorText}>{quantityError}</Text> : null}
        </View>
      </ScrollView>

      <View style={styles.footerContainer}>
        <Button title="Confirm" mode="contained" size="100%" disabled={!canConfirm} onPress={handleConfirm} />
      </View>
    </View>
  );
}
