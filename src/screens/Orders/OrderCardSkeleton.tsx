import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Card } from 'react-native-paper';

import LayoutStyle from '../../assets/styles/LayoutStyle';
import { ShimmerBlock, SkeletonDivider } from '../../components/ContentSkeleton';

export default function OrderCardSkeleton() {
  return (
    <Card style={LayoutStyle.listItemContainer}>
      <Card.Content>
        <View style={styles.headerRow}>
          <ShimmerBlock style={styles.identifier} />
          <ShimmerBlock style={styles.statusChip} />
        </View>
        <SkeletonDivider />
        <ShimmerBlock style={styles.destination} />
        <View style={styles.infoRow}>
          <ShimmerBlock style={styles.chipInfo} />
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
  infoRow: { flexDirection: 'row', marginTop: 8 },
  footerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  columnItem: { flexDirection: 'column' },
  identifier: { width: 120, height: 14, borderRadius: 4 },
  statusChip: { width: 80, height: 24, borderRadius: 4 },
  destination: { width: '70%', height: 16, borderRadius: 4, marginTop: 4 },
  chipInfo: { width: 180, height: 24, borderRadius: 4 },
  label: { width: 90, height: 10, borderRadius: 4, marginBottom: 6 },
  value: { width: 110, height: 12, borderRadius: 4 }
});
