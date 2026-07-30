import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Card } from 'react-native-paper';

import LayoutStyle from '../../assets/styles/LayoutStyle';
import { ShimmerBlock, SkeletonDivider } from '../../components/ContentSkeleton';

export default function DiscretePickingCardSkeleton() {
  return (
    <Card style={LayoutStyle.listItemContainer}>
      <Card.Content>
        <View style={styles.headerRow}>
          <ShimmerBlock style={styles.orderNumber} />
          <ShimmerBlock style={styles.statusChip} />
        </View>
        <SkeletonDivider />
        <ShimmerBlock style={styles.destination} />
        <ShimmerBlock style={styles.destinationType} />
        <View style={styles.footerRow}>
          <ShimmerBlock style={styles.metaChip} />
          <ShimmerBlock style={styles.metaChipWide} />
        </View>
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  footerRow: { flexDirection: 'row', marginTop: 8 },
  orderNumber: { width: 150, height: 28, borderRadius: 4 },
  statusChip: { width: 80, height: 28, borderRadius: 4 },
  destination: { width: '70%', height: 16, borderRadius: 4 },
  destinationType: { width: '45%', height: 12, borderRadius: 4, marginTop: 6 },
  metaChip: { width: 110, height: 28, borderRadius: 4, marginRight: 8 },
  metaChipWide: { width: 90, height: 28, borderRadius: 4 }
});
