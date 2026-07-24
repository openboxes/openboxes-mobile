import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { Caption, Card, Chip, Divider, Text } from 'react-native-paper';

import { HYPHEN } from '../../constants';
import { DiscretePickingOrder } from '../../types/picking';
import { DELIVERY_TYPES } from './constants';
import styles from './discretePickingStyles';

const DELIVERY_TYPE_LABELS: Record<string, string> = DELIVERY_TYPES.reduce<Record<string, string>>((acc, type) => {
  acc[type.code] = type.label;
  return acc;
}, {});

type Props = {
  order: DiscretePickingOrder;
  onPress: (order: DiscretePickingOrder) => void;
};

export default function DiscretePickingOrderCard({ order, onPress }: Props) {
  const queueLabel = order.deliveryTypeCode
    ? DELIVERY_TYPE_LABELS[order.deliveryTypeCode] ?? order.deliveryTypeCode
    : null;
  const lineLabel = `${order.taskCount} ${order.taskCount === 1 ? 'line' : 'lines'}`;

  return (
    <TouchableOpacity activeOpacity={0.85} style={styles.cardTouchable} onPress={() => onPress(order)}>
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.cardHeader}>
            <Text style={styles.orderNumber} numberOfLines={1}>
              {order.requisitionNumber ?? HYPHEN}
            </Text>
            <Chip
              icon={order.inProgress ? 'progress-clock' : 'check-circle-outline'}
              style={styles.metaChip}
              textStyle={styles.metaChipText}
            >
              {order.inProgress ? 'In progress' : 'Ready'}
            </Chip>
          </View>

          <Divider style={styles.cardDivider} />

          <Text style={styles.destination} numberOfLines={2}>
            {order.destination ?? HYPHEN}
          </Text>
          {order.destinationLocationType ? <Caption>{order.destinationLocationType}</Caption> : null}

          <View style={styles.metaRow}>
            {queueLabel ? (
              <Chip icon="tag-outline" style={styles.metaChip} textStyle={styles.metaChipText}>
                {queueLabel}
              </Chip>
            ) : null}
            <Chip icon="package-variant-closed" style={styles.metaChip} textStyle={styles.metaChipText}>
              {lineLabel}
            </Chip>
          </View>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );
}
