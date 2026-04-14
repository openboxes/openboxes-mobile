import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Alert, ScrollView, ToastAndroid, View } from 'react-native';
import { Caption, Chip, Divider, TextInput as PaperTextInput, Text, Title } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';

import AsyncModalSelect from '../../components/AsyncModalSelect';
import Button from '../../components/Button';
import { DetailFormSkeleton } from '../../components/ContentSkeleton';
import EmptyView from '../../components/EmptyView';
import { QuantityIcon } from '../../components/Icons';
import { EMPTY_FALLBACK } from '../../constants';
import { searchInternalLocations } from '../../redux/actions/locations';
import { updateStockTransfer } from '../../redux/actions/transfers';
import { RootState } from '../../redux/reducers';
import { DetailChip } from '../../types/sortation';
import styles from './styles';

type TransferRouteParams = {
  Transfer: {
    item: any;
  };
};

type TransferRouteProp = RouteProp<TransferRouteParams, 'Transfer'>;

function buildDetailsChips(item: any, showExpirationDate: boolean, showLotNumber: boolean): DetailChip[] {
  const chips: DetailChip[] = [
    {
      icon: 'barcode',
      label: 'Product',
      value: `${item?.product?.productCode} - ${item?.product?.name}`
    }
  ];

  if (showExpirationDate) {
    chips.push({ icon: 'calendar', label: 'Expiry Date', value: item?.expirationDate ?? 'Never' });
  }

  if (showLotNumber) {
    chips.push({ icon: 'tag', label: 'Lot Number', value: item?.lotNumber ?? 'Default' });
  }

  chips.push({
    icon: () => <QuantityIcon size={16} color="#000" />,
    label: 'Available to Transfer',
    value: item.quantityAvailable ?? EMPTY_FALLBACK
  });

  return chips;
}

function validateTransfer(parsed: number | undefined, item: any, binToLocationData: any): string | null {
  if (!parsed || parsed <= 0) {
    return 'Please enter a quantity greater than zero.';
  }
  if (parsed > Number(item.quantityAvailable)) {
    return 'Quantity to transfer is greater than quantity available.';
  }
  if (!binToLocationData?.id) {
    return 'Please select a destination bin location.';
  }
  if (binToLocationData.id === item?.binLocation?.id) {
    return 'Origin and destination bin locations cannot be the same.';
  }
  return null;
}

export default function Transfer() {
  const route = useRoute<TransferRouteProp>();
  const navigation = useNavigation<any>();
  const dispatch = useDispatch();
  const { item } = route.params;
  const location = useSelector((rootState: RootState) => rootState.mainReducer.currentLocation);
  const { productSummaryConfig } = useSelector((state: RootState) => state.settingsReducer);

  const [binToLocationData, setBinToLocationData] = useState<any>(null);
  const [quantity, setQuantity] = useState<string>(item?.quantityAvailable?.toString() ?? '');
  const [internalLocations, setInternalLocations] = useState<any[]>([]);
  const [isLoadingLocations, setIsLoadingLocations] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchInternalLocations = useCallback(() => {
    setIsLoadingLocations(true);
    dispatch(
      searchInternalLocations(
        '',
        { 'parentLocation.id': location.id, max: 25, offset: 0 },
        (data: any) => {
          setIsLoadingLocations(false);
          if (data?.error) {
            Alert.alert(
              'Failed to Load Locations',
              data.errorMessage ?? 'Could not load internal locations. Please try again.',
              [
                { text: 'Retry', onPress: fetchInternalLocations },
                { text: 'Cancel', style: 'cancel' }
              ]
            );
          } else if (data?.data) {
            setInternalLocations(data.data.map((loc: any) => ({ name: loc.name, id: loc.id })));
          }
        },
        true
      )
    );
  }, [dispatch, location.id]);

  useEffect(() => {
    fetchInternalLocations();
  }, [fetchInternalLocations]);

  const handleTransfer = useCallback(() => {
    const parsed = quantity.trim() === '' ? undefined : parseInt(quantity, 10);
    const error = validateTransfer(parsed, item, binToLocationData);

    if (error) {
      Alert.alert('Validation Error', error);
      return;
    }

    setIsSubmitting(true);

    const request: any = {
      status: 'COMPLETED',
      stockTransferNumber: '',
      description: '',
      'origin.id': location.id,
      'destination.id': location.id,
      stockTransferItems: [
        {
          product: { id: item.product.id },
          inventoryItem: { id: item['inventoryItem.id'] },
          location: { id: location.id },
          originBinLocation: { id: item?.binLocation?.id },
          destinationBinLocation: { id: binToLocationData.id },
          quantity: parsed
        }
      ]
    };

    dispatch(
      updateStockTransfer(request, (data: any) => {
        setIsSubmitting(false);
        if (data?.error) {
          Alert.alert('Transfer Failed', data.errorMessage ?? 'Failed to complete transfer.', [
            { text: 'Retry', onPress: handleTransfer },
            { text: 'Cancel', style: 'cancel' }
          ]);
        } else {
          ToastAndroid.show('Transferred item successfully!', ToastAndroid.SHORT);
          navigation.navigate('ProductDetails', {
            product: item.product,
            refetchProduct: true
          });
        }
      })
    );
  }, [quantity, item, binToLocationData, location, dispatch, navigation]);

  const showLotNumber = useMemo(() => productSummaryConfig?.lotNumber !== false, [productSummaryConfig]);
  const showExpirationDate = useMemo(() => productSummaryConfig?.expirationDate !== false, [productSummaryConfig]);
  const detailsChips = useMemo(
    () => buildDetailsChips(item, showExpirationDate, showLotNumber),
    [item, showExpirationDate, showLotNumber]
  );

  if (!item) {
    return (
      <View style={styles.emptyContainer}>
        <EmptyView title="Item Not Found" description="The item you are looking for is not available." />
      </View>
    );
  }

  if (isLoadingLocations) {
    return <DetailFormSkeleton />;
  }

  const parsed = quantity.trim() === '' ? 0 : parseInt(quantity, 10);
  const isTransferDisabled = !binToLocationData?.id || !parsed || parsed <= 0 || isSubmitting;

  return (
    <View style={styles.screenContainer}>
      <ScrollView keyboardShouldPersistTaps="handled" style={styles.contentContainer}>
        <View style={styles.productDetails}>
          <Title style={styles.title}>
            {item?.binLocation?.name ?? 'Default Bin'}
            {location.name ? <Text style={styles.titleParent}>{` (${location.name})`}</Text> : null}
          </Title>
          <Caption style={styles.subtitle}>Transferring from this bin</Caption>

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
          <Text style={styles.fieldLabel}>Destination Bin Location</Text>
          <AsyncModalSelect
            placeholder="Search or select a bin location"
            label="Destination Bin Location"
            initValue={binToLocationData?.name || ''}
            initialData={internalLocations}
            searchAction={searchInternalLocations}
            searchActionParams={{ 'parentLocation.id': location.id }}
            onSelect={(selectedItem: any) => {
              if (selectedItem) {
                setBinToLocationData(selectedItem);
              }
            }}
          />

          <View style={styles.fieldGap}>
            <PaperTextInput
              autoCompleteType="off"
              mode="outlined"
              label="Quantity to Transfer"
              placeholder={String(item?.quantityAvailable ?? '')}
              value={quantity}
              keyboardType="number-pad"
              onChangeText={setQuantity}
            />
          </View>
        </View>
      </ScrollView>

      <View style={styles.bottom}>
        <Button
          title={isSubmitting ? 'Transferring...' : 'Transfer'}
          mode="contained"
          size="100%"
          disabled={isTransferDisabled}
          onPress={handleTransfer}
        />
      </View>
    </View>
  );
}
