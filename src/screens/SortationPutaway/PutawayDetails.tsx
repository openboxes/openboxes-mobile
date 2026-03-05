import React from 'react';
import { Text, View } from 'react-native';
import { Chip, Divider, Title } from 'react-native-paper';

import { EMPTY_FALLBACK } from '../../constants';
import { DetailChip, SortationTask } from '../../types/sortation';
import styles from './styles';

type PutawayDetailsProps = {
  putawayDetails: SortationTask;
  taskIndex?: number;
  totalTasks?: number;
  showTaskCounter?: boolean;
};

export default function PutawayDetails({
  putawayDetails,
  taskIndex,
  totalTasks,
  showTaskCounter = true
}: PutawayDetailsProps) {
  const { inventoryItem, quantity, container, destination } = putawayDetails;

  const detailsChips: DetailChip[] = [
    {
      icon: 'identifier',
      label: 'Putaway Container ID',
      value: container?.locationNumber ?? EMPTY_FALLBACK
    },
    {
      icon: 'map-marker',
      label: 'Putaway Location',
      value: destination?.name ?? EMPTY_FALLBACK
    },
    {
      icon: 'cube',
      label: 'Putaway Quantity',
      value: quantity ?? EMPTY_FALLBACK
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
        {showTaskCounter && taskIndex !== undefined && totalTasks !== undefined && (
          <Chip icon="navigation" style={styles.chipDefault} textStyle={styles.chipText}>
            Tasks:{' '}
            <Text style={styles.bold}>
              {taskIndex + 1} / {totalTasks}
            </Text>
          </Chip>
        )}
      </View>

      <Divider style={styles.contentDivider} />

      <Title style={styles.title}>{inventoryItem?.product?.name}</Title>

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
