import React from 'react';
import { Text, View } from 'react-native';
import { Caption, Chip, Divider, Title } from 'react-native-paper';

import { HYPHEN } from '../../constants';
import { DetailChip } from '../../types/sortation';
import styles from './styles';

type PutawayDetailsProps = {
  // TODO [Putaway]: Create a proper type for putawayDetails
  putawayDetails: any;
};

export default function PutawayDetails({ putawayDetails }: PutawayDetailsProps) {
  const { inventoryItem, quantity, container, destination } = putawayDetails;

  const detailsChips: DetailChip[] = [
    {
      icon: 'identifier',
      label: 'Putaway Container ID',
      value: container?.locationNumber ?? HYPHEN
    },
    {
      icon: 'map-marker',
      label: 'Putaway Location',
      value: destination?.name ?? HYPHEN
    },
    {
      icon: 'cube',
      label: 'Putaway Quantity',
      value: quantity ?? HYPHEN
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
            {label}: <Text style={styles.bold}>{value ?? HYPHEN}</Text>
          </Text>
        </Chip>
      ))}
    </View>
  );
}
