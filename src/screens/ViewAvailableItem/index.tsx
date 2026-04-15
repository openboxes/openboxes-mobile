import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import React, { useMemo, useState } from 'react';
import { Image, View } from 'react-native';
import { Chip, Divider, Text, Title } from 'react-native-paper';
import { useSelector } from 'react-redux';

import DefaultProductIcon from '../../assets/images/icon_default_product.svg';
import Button from '../../components/Button';
import { LocationIcon, QuantityIcon } from '../../components/Icons';
import { EMPTY_FALLBACK } from '../../constants';
import { RootState } from '../../redux/reducers';
import { DetailChip } from '../../types/sortation';
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
  const [availableItem, setAvailableItem] = useState(route.params.item);
  const source = route.params.imageUrl ? { uri: route.params.imageUrl } : null;
  const { productSummaryConfig } = useSelector((state: RootState) => state.settingsReducer);

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
          {source ? <Image style={styles.productImage} source={source} /> : <DefaultProductIcon />}
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
          onPress={() => navigation.navigate('Transfer', { item: availableItem })}
        />
      </View>
    </View>
  );
}
