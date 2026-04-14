import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import React, { useCallback, useMemo, useState } from 'react';
import { Alert, ScrollView, ToastAndroid, View } from 'react-native';
import { Caption, Chip, Divider, Text, TextInput as PaperTextInput, Title } from 'react-native-paper';
import DropDown from 'react-native-paper-dropdown';
import { useDispatch, useSelector } from 'react-redux';

import Button from '../../components/Button';
import { QuantityIcon } from '../../components/Icons';
import { EMPTY_FALLBACK } from '../../constants';
import { stockAdjustments } from '../../redux/actions/products';
import { RootState } from '../../redux/reducers';
import { DetailChip } from '../../types/sortation';
import styles from './styles';

const reasonCodes = [
  { value: 'CONSUMED', label: 'Consumed', sortOrder: 24 },
  { value: 'CORRECTION', label: 'Correction', sortOrder: 30 },
  { value: 'DAMAGED', label: 'Damaged product', sortOrder: 4 },
  { value: 'DATA_ENTRY_ERROR', label: 'Data entry error', sortOrder: 16 },
  { value: 'EXPIRED', label: 'Expired product', sortOrder: 3 },
  { value: 'FOUND', label: 'Found', sortOrder: 26 },
  { value: 'MISSING', label: 'Missing', sortOrder: 27 },
  { value: 'RECOUNTED', label: 'Recounted', sortOrder: 29 },
  { value: 'REJECTED', label: 'Rejected', sortOrder: 32 },
  { value: 'RETURNED', label: 'Returned', sortOrder: 25 },
  { value: 'SCRAPPED', label: 'Scrapped', sortOrder: 31 },
  { value: 'STOLEN', label: 'Stolen', sortOrder: 28 },
  { value: 'OTHER', label: 'Other', sortOrder: 100 }
];

type AdjustStockRouteParams = {
  AdjustStock: {
    item: any;
    onSelect?: (data: any) => void;
  };
};

type AdjustStockRouteProp = RouteProp<AdjustStockRouteParams, 'AdjustStock'>;

export default function AdjustStock() {
  const dispatch = useDispatch();
  const route = useRoute<AdjustStockRouteProp>();
  const navigation = useNavigation<any>();
  const { item, onSelect } = route.params;
  const location = useSelector((state: RootState) => state.mainReducer.currentLocation);
  const { productSummaryConfig } = useSelector((state: RootState) => state.settingsReducer);

  const [quantityAdjusted, setQuantityAdjusted] = useState<string>(
    item.quantityAvailable?.toString() ?? ''
  );
  const [reasonCode, setReasonCode] = useState<string | null>(null);
  const [comments, setComments] = useState('');
  const [showDropDown, setShowDropDown] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSave = useCallback(() => {
    const parsed = quantityAdjusted.trim() === '' ? undefined : parseInt(quantityAdjusted, 10);

    if (parsed === undefined || isNaN(parsed) || parsed < 0) {
      Alert.alert('Invalid Quantity', 'Please enter a valid quantity.');
      return;
    }

    if (parsed === item.quantityAvailable) {
      Alert.alert('No Change', 'The adjusted quantity is the same as the current quantity.');
      return;
    }

    if (!reasonCode) {
      Alert.alert('Missing Reason', 'Please select a reason code.');
      return;
    }

    if (!comments.trim()) {
      Alert.alert('Missing Comments', 'Please enter a comment explaining the adjustment.');
      return;
    }

    setIsSubmitting(true);

    const request = {
      'location.id': location.id,
      'product.id': item.product.id,
      inventoryItem: item?.['inventoryItem.id'] ?? '',
      binLocation: item?.binLocation?.id ?? '',
      currentQuantity: item.quantityAvailable,
      reasonCode,
      newQuantity: parsed,
      comment: comments
    };

    dispatch(
      stockAdjustments(request, (data: any) => {
        setIsSubmitting(false);
        if (data?.error) {
          Alert.alert(
            'Unable to Save',
            data.errorMessage ?? 'Unexpected error occurred on the server.',
            [
              { text: 'Retry', onPress: handleSave },
              { text: 'Cancel', style: 'cancel' }
            ]
          );
        } else if (data) {
          ToastAndroid.show('Stock adjustment saved successfully', ToastAndroid.SHORT);
          navigation.navigate('ProductDetails', {
            product: item.product,
            refetchProduct: true
          });
          onSelect?.(data?.data?.[0]);
        }
      })
    );
  }, [quantityAdjusted, item, reasonCode, comments, location, dispatch, navigation, onSelect]);

  const showLotNumber = useMemo(() => productSummaryConfig?.lotNumber !== false, [productSummaryConfig]);
  const showExpirationDate = useMemo(() => productSummaryConfig?.expirationDate !== false, [productSummaryConfig]);

  const detailsChips: DetailChip[] = [
    {
      icon: 'barcode',
      label: 'Product',
      value: `${item?.product?.productCode} - ${item?.product?.name}`
    },
    ...(showExpirationDate
      ? [{ icon: 'calendar' as const, label: 'Expiry Date', value: item?.expirationDate ?? 'Never' }]
      : []),
    ...(showLotNumber
      ? [{ icon: 'tag' as const, label: 'Lot Number', value: item?.lotNumber ?? 'Default' }]
      : []),
    {
      icon: () => <QuantityIcon size={16} color="#000" />,
      label: 'Current Quantity',
      value: item.quantityAvailable ?? EMPTY_FALLBACK
    }
  ];

  const isSaveDisabled = !comments.trim() || !reasonCode || isSubmitting;

  return (
    <View style={styles.screenContainer}>
      <ScrollView keyboardShouldPersistTaps="handled" style={styles.contentContainer}>
        <View style={styles.productDetails}>
          <Title style={styles.title}>
            {item?.binLocation?.name ?? 'Default Bin'}
            {location.name ? <Text style={styles.titleParent}>{` (${location.name})`}</Text> : null}
          </Title>

          <Caption style={styles.subtitle}>Adjusting inventory at this bin</Caption>

          <Divider style={styles.contentDivider} />

          {detailsChips.map(({ icon, value, label }) => (
            <Chip key={label} icon={icon} style={[styles.chipDefault, styles.chipSpacing]}>
              <Text style={styles.chipText}>
                {label}: <Text style={[styles.bold, styles.chipText]}>{value}</Text>
              </Text>
            </Chip>
          ))}
        </View>

        <Divider />

        <View style={styles.formContainer}>
          <PaperTextInput
            mode="outlined"
            label="New Quantity"
            placeholder={String(item?.quantityAvailable ?? '')}
            value={quantityAdjusted}
            onChangeText={setQuantityAdjusted}
            keyboardType="number-pad"
          />

          <View style={styles.fieldGap}>
            <DropDown
              label="Reason Code"
              mode="outlined"
              visible={showDropDown}
              showDropDown={() => setShowDropDown(true)}
              value={reasonCode}
              setValue={setReasonCode}
              list={reasonCodes}
              onDismiss={() => setShowDropDown(false)}
            />
          </View>

          <View style={styles.fieldGap}>
            <PaperTextInput
              mode="outlined"
              label="Comments"
              placeholder="Explain the reason for adjustment"
              value={comments}
              onChangeText={setComments}
            />
          </View>
        </View>
      </ScrollView>

      <View style={styles.bottom}>
        <Button
          title={isSubmitting ? 'Saving...' : 'Adjust Stock'}
          mode="contained"
          size="100%"
          disabled={isSaveDisabled}
          onPress={handleSave}
        />
      </View>
    </View>
  );
}
