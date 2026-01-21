import React from 'react';
import { Text, View } from 'react-native';
import { Caption, Chip, Divider, Title } from 'react-native-paper';

import { EMPTY_FALLBACK } from '../../constants';
import { DetailChip } from '../../types/sortation';
import { MOCKED_CYCLE_COUNT } from './mocked-data';
import styles from './styles';

type CycleCountDetails = typeof MOCKED_CYCLE_COUNT;

type CycleCountDetailsProps = {
  cycleCountDetails: CycleCountDetails;
};

export default function CycleCountDetails({ cycleCountDetails = MOCKED_CYCLE_COUNT }: CycleCountDetailsProps) {
  const { inventoryItem, id, location } = cycleCountDetails;

  const detailsChips: DetailChip[] = [
    {
      icon: 'identifier',
      label: 'Cycle Count List Id',
      value: id
    },
    {
      icon: 'map-marker',
      label: 'Location',
      value: location?.locationNumber ?? EMPTY_FALLBACK
    }
  ];

  return (
    <View style={styles.productDetails}>
      <View style={styles.headerRow}>
        <Chip icon="barcode" style={styles.chipDefault} textStyle={styles.chipText}>
          <Text>
            Product Code: <Text style={styles.bold}>{inventoryItem?.product?.productCode}</Text>
          </Text>
        </Chip>
      </View>

      <Divider style={styles.contentDivider} />

      <Title style={styles.title}>{inventoryItem?.product?.name}</Title>
      <Caption style={styles.caption}>{inventoryItem?.product?.description}</Caption>

      {detailsChips.map(({ icon, value, label }) => (
        <Chip key={label} icon={icon} style={[styles.chipDefault, styles.topSpace]} textStyle={styles.chipText}>
          <Text>
            {label}: <Text style={styles.bold}>{value}</Text>
          </Text>
        </Chip>
      ))}
    </View>
  );
}
