import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Card } from 'react-native-paper';

import { ShimmerBlock, SkeletonDivider } from '../../components/ContentSkeleton';
import Theme from '../../utils/Theme';

export default function DiscretePickingCardSkeleton() {
  return (
    <View style={styles.wrapper}>
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.headerRow}>
            <ShimmerBlock style={styles.orderNumber} />
            <ShimmerBlock style={styles.statusChip} />
          </View>
          <SkeletonDivider />
          <ShimmerBlock style={styles.destination} />
          <View style={styles.metaRow}>
            <ShimmerBlock style={styles.metaChip} />
            <ShimmerBlock style={styles.metaChip} />
          </View>
        </Card.Content>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginHorizontal: Theme.spacing.medium,
    marginBottom: Theme.spacing.small - 2
  },
  card: {
    borderRadius: Theme.roundness,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ddd'
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Theme.spacing.small - 2
  },
  orderNumber: { width: 140, height: 22, borderRadius: 4 },
  statusChip: { width: 90, height: 24, borderRadius: Theme.roundness },
  destination: { width: '70%', height: 16, borderRadius: 4, marginTop: 6 },
  metaRow: { flexDirection: 'row', marginTop: Theme.spacing.small },
  metaChip: { width: 90, height: 24, borderRadius: Theme.roundness, marginRight: Theme.spacing.small }
});
