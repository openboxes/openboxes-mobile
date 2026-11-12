import { RouteProp, useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { Alert, Image, View } from 'react-native';
import { Chip, Divider, Text, Title } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';

import DefaultProductIcon from '../../assets/images/icon_default_product.svg';
import Button from '../../components/Button';
import { LocationIcon, QuantityIcon } from '../../components/Icons';
import { EMPTY_FALLBACK } from '../../constants';
import { getStockTransferCandidatesAction } from '../../redux/actions/createTransfer';
import { RootState } from '../../redux/reducers';
import { StockTransferCandidate } from '../CreateTransfer/types';
import { toSelectedInventoryItem } from '../CreateTransfer/utils';
import { DetailChip } from '../../types/sortation';
import Theme from '../../utils/Theme';
import styles from './styles';

type ViewAvailableItemRouteParams = {
  ViewAvailableItem: {
    item: any;
    imageUrl?: string;
  };
};

type ViewAvailableItemRouteProp = RouteProp<ViewAvailableItemRouteParams, 'ViewAvailableItem'>;

export default function ViewAvailableItem() {
  const route = useRoute<ViewAvailableItemRouteProp>();
  const navigation = useNavigation<any>();
  const dispatch = useDispatch();
  const currentLocation = useSelector((state: RootState) => state.mainReducer.currentLocation);
  const pendingTransfer = useRef<symbol | null>(null);
  const [isStartingTransfer, setIsStartingTransfer] = useState(false);
  const [availableItem, setAvailableItem] = useState(route.params.item);
  const source = route.params.imageUrl ? { uri: route.params.imageUrl } : null;
  const { productSummaryConfig } = useSelector((state: RootState) => state.settingsReducer);

  useFocusEffect(
    useCallback(() => {
      setIsStartingTransfer(false);
      return () => {
        pendingTransfer.current = null;
      };
    }, [])
  );

  const showLotNumber = useMemo(() => productSummaryConfig?.lotNumber !== false, [productSummaryConfig]);
  const showLocationType = useMemo(() => productSummaryConfig?.locationType !== false, [productSummaryConfig]);
  const showExpirationDate = useMemo(() => productSummaryConfig?.expirationDate !== false, [productSummaryConfig]);

  const onAdjustStockSelect = (data: any) => {
    setAvailableItem((prev: any) => ({
      ...prev,
      quantityOnHand: data?.quantityAvailable,
      quantityAvailable: data?.quantityAvailable,
      quantityAvailableToPromise: data?.quantityAdjusted
    }));
  };

  const handleTransfer = () => {
    if (pendingTransfer.current || !currentLocation?.id) {
      return;
    }
    const request = Symbol();
    pendingTransfer.current = request;
    setIsStartingTransfer(true);
    dispatch(
      getStockTransferCandidatesAction(currentLocation.id, (response: any) => {
        if (pendingTransfer.current !== request) {
          return;
        }
        pendingTransfer.current = null;
        setIsStartingTransfer(false);
        if (response?.error) {
          Alert.alert('Transfer Failed', response.errorMessage || 'Failed to load available stock.');
          return;
        }
        const candidate = (response?.data as StockTransferCandidate[] | undefined)?.find(
          (item) =>
            item.product?.id === availableItem.product?.id &&
            item.inventoryItem?.id === (availableItem.inventoryItem?.id ?? availableItem['inventoryItem.id']) &&
            (item.originBinLocation?.id ?? null) === (availableItem.binLocation?.id ?? null)
        );
        if (!candidate || candidate.quantityNotPicked <= 0) {
          Alert.alert('Stock Unavailable', 'This inventory item no longer has stock available to transfer.');
          return;
        }
        navigation.navigate('CreateTransferQuantity', { item: toSelectedInventoryItem(candidate) });
      })
    );
  };

  const detailsChips: DetailChip[] = [
    {
      icon: () => <LocationIcon size={16} color="#000" />,
      label: 'Bin Location',
      value:
        showLocationType && availableItem?.binLocation?.locationType?.name
          ? `${availableItem?.binLocation?.name ?? 'Default'} (${availableItem.binLocation.locationType.name})`
          : availableItem?.binLocation?.name ?? 'Default'
    },
    ...(showExpirationDate
      ? [
          {
            icon: 'calendar' as const,
            label: 'Expiry Date',
            value: availableItem?.expirationDate ?? 'Never'
          }
        ]
      : []),
    ...(showLotNumber
      ? [
          {
            icon: 'tag' as const,
            label: 'Lot Number',
            value: availableItem?.lotNumber ?? 'Default'
          }
        ]
      : []),
    {
      icon: () => <QuantityIcon size={16} color="#000" />,
      label: 'Quantity On Hand',
      value: availableItem?.quantityOnHand ?? EMPTY_FALLBACK
    },
    {
      icon: () => <QuantityIcon size={16} color="#000" />,
      label: 'Quantity Available',
      value: availableItem?.quantityAvailable ?? EMPTY_FALLBACK
    }
  ];

  return (
    <View style={styles.screenContainer}>
      <View style={styles.productDetails}>
        <View style={styles.headerRow}>
          <Chip icon="barcode" style={styles.chipDefault} textStyle={styles.chipText}>
            {availableItem?.product?.productCode}
          </Chip>
          {source ? (
            <Image style={styles.productImage} source={source} />
          ) : (
            <DefaultProductIcon fill={Theme.colors.primary} />
          )}
        </View>

        <Divider style={styles.contentDivider} />

        <Title style={styles.title}>{availableItem?.product?.name}</Title>

        {detailsChips.map(({ icon, value, label }) => (
          <Chip key={label} icon={icon} style={[styles.chipDefault, styles.chipSpacing]}>
            <Text style={styles.chipText}>
              {label}: <Text style={[styles.bold, styles.chipText]}>{value}</Text>
            </Text>
          </Chip>
        ))}
      </View>

      <Divider />

      <View style={styles.spacer} />

      <View style={styles.bottom}>
        <Button
          title="Adjust Stock"
          size="100%"
          style={styles.buttonSpacing}
          onPress={() =>
            navigation.navigate('AdjustStock', {
              item: availableItem,
              onSelect: onAdjustStockSelect
            })
          }
        />
        <Button
          title="Transfer"
          size="100%"
          variant="secondary"
          disabled={isStartingTransfer}
          onPress={handleTransfer}
        />
      </View>
    </View>
  );
}
