import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Card } from 'react-native-paper';

import LayoutStyle from '../../assets/styles/LayoutStyle';
import { ShimmerBlock, SkeletonDivider } from '../../components/ContentSkeleton';

export default function ShipmentCardSkeleton() {
  return (
    <Card style={LayoutStyle.listItemContainer}>
      <Card.Content>
        <View style={styles.headerRow}>
          <ShimmerBlock style={styles.identifier} />
          <ShimmerBlock style={styles.statusChip} />
        </View>
        <SkeletonDivider />
        <ShimmerBlock style={styles.name} />
        <View style={styles.chipsRow}>
          <ShimmerBlock style={styles.chipSmall} />
          <ShimmerBlock style={styles.chipSmall} />
        </View>
        <SkeletonDivider />
        <View style={styles.footerRow}>
          <View style={styles.columnItem}>
            <ShimmerBlock style={styles.label} />
            <ShimmerBlock style={styles.value} />
          </View>
          <View style={styles.columnItem}>
            <ShimmerBlock style={styles.label} />
            <ShimmerBlock style={styles.value} />
          </View>
        </View>
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  chipsRow: { flexDirection: 'row', marginTop: 8 },
  footerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  columnItem: { flexDirection: 'column' },
  identifier: { width: 130, height: 14, borderRadius: 4 },
  statusChip: { width: 110, height: 24, borderRadius: 4 },
  name: { width: '65%', height: 16, borderRadius: 4, marginTop: 4 },
  chipSmall: { width: 100, height: 24, borderRadius: 4, marginRight: 8 },
  label: { width: 80, height: 10, borderRadius: 4, marginBottom: 6 },
  value: { width: 120, height: 12, borderRadius: 4 }
});
