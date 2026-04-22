import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Card } from 'react-native-paper';

import LayoutStyle from '../../assets/styles/LayoutStyle';
import { ShimmerBlock, SkeletonDivider } from '../../components/ContentSkeleton';

export default function PutawayCandidateCardSkeleton() {
  return (
    <Card style={LayoutStyle.listItemContainer}>
      <Card.Content>
        <View style={styles.headerRow}>
          <ShimmerBlock style={styles.locationChip} />
          <ShimmerBlock style={styles.statusChip} />
        </View>
        <SkeletonDivider />
        <ShimmerBlock style={styles.title} />
        <ShimmerBlock style={styles.caption} />
        <View style={styles.chipsRow}>
          <ShimmerBlock style={styles.chip} />
          <ShimmerBlock style={styles.chip} />
        </View>
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  chipsRow: { flexDirection: 'row', marginTop: 8, flexWrap: 'wrap' },
  locationChip: { width: 170, height: 24, borderRadius: 4 },
  statusChip: { width: 80, height: 24, borderRadius: 4 },
  title: { width: '70%', height: 16, borderRadius: 4, marginTop: 4, marginBottom: 6 },
  caption: { width: '45%', height: 12, borderRadius: 4 },
  chip: { width: 140, height: 24, borderRadius: 4, marginRight: 8 }
});
