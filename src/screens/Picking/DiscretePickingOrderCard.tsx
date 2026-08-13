import React from 'react';
import { View } from 'react-native';
import { Caption, Card, Chip, Divider, Subheading, Text } from 'react-native-paper';

import { LayoutStyle } from '../../assets/styles';
import { HYPHEN } from '../../constants';
import { DiscretePickingOrder } from '../../types/picking';
import Theme from '../../utils/Theme';
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
  const deliveryTypeLabel = order.deliveryTypeCode
    ? DELIVERY_TYPE_LABELS[order.deliveryTypeCode] ?? order.deliveryTypeCode
    : null;
  const lineCountLabel = order.taskCount === 1 ? 'Line' : 'Lines';
  const assigneeName = order.assignee ? `${order.assignee.firstName} ${order.assignee.lastName}`.trim() : null;

  return (
    <Card style={LayoutStyle.listItemContainer} onPress={() => onPress(order)}>
      <Card.Content>
        <View style={styles.headerRow}>
          <Chip icon="identifier" style={[styles.chipDefault, styles.orderNumberChip]}>
            <Text style={[styles.orderNumberText, styles.fontBold]}>{order.requisitionNumber ?? HYPHEN}</Text>
          </Chip>
          <Chip
            icon={order.inProgress ? 'progress-clock' : 'check-circle-outline'}
            selectedColor={order.inProgress ? Theme.colors.infoForeground : Theme.colors.successForeground}
            style={[
              styles.chipDefault,
              styles.statusChip,
              order.inProgress ? styles.statusChipInProgress : styles.statusChipReady
            ]}
          >
            <Text
              style={[
                styles.chipText,
                styles.fontBold,
                order.inProgress ? styles.statusChipTextInProgress : styles.statusChipTextReady
              ]}
            >
              {order.inProgress ? 'In progress' : 'Ready'}
            </Text>
          </Chip>
        </View>

        <Divider style={styles.contentDivider} />

        <Subheading style={styles.destination} numberOfLines={2}>
          {order.destination ?? HYPHEN}
        </Subheading>
        {order.destinationLocationType ? (
          <Caption style={styles.destinationType}>{order.destinationLocationType}</Caption>
        ) : null}

        <View style={styles.additionalInfoRow}>
          {deliveryTypeLabel ? (
            <Chip icon="tag-outline" style={styles.chipDefault}>
              <Text style={styles.chipText}>
                Type: <Text style={[styles.chipText, styles.fontBold]}>{deliveryTypeLabel}</Text>
              </Text>
            </Chip>
          ) : null}
          <Chip icon="package-variant-closed" style={styles.chipDefault}>
            <Text style={styles.chipText}>
              {lineCountLabel}: <Text style={[styles.chipText, styles.fontBold]}>{order.taskCount}</Text>
            </Text>
          </Chip>
          {assigneeName ? (
            <Chip icon="account" style={styles.chipDefault}>
              <Text style={styles.chipText}>
                Assigned to: <Text style={[styles.chipText, styles.fontBold]}>{assigneeName}</Text>
              </Text>
            </Chip>
          ) : null}
        </View>
      </Card.Content>
    </Card>
  );
}
