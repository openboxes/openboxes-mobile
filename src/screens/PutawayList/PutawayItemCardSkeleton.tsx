import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Card } from 'react-native-paper';

import LayoutStyle from '../../assets/styles/LayoutStyle';
import { ShimmerBlock, SkeletonDivider } from '../../components/ContentSkeleton';

export default function PutawayItemCardSkeleton() {
  return (
    <Card style={LayoutStyle.listItemContainer}>
      <Card.Content>
        <View style={styles.headerRow}>
          <ShimmerBlock style={styles.locationChip} />
        </View>
        <SkeletonDivider />
        <ShimmerBlock style={styles.title} />
        <ShimmerBlock style={styles.caption} />
        <View style={styles.footerRow}>
          <ShimmerBlock style={styles.putawayChip} />
        </View>
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  headerRow: { flexDirection: 'row' },
  footerRow: { flexDirection: 'row', marginTop: 8 },
  locationChip: { width: 170, height: 24, borderRadius: 4 },
  title: { width: '65%', height: 16, borderRadius: 4, marginTop: 4, marginBottom: 6 },
  caption: { width: '45%', height: 12, borderRadius: 4 },
  putawayChip: { width: 200, height: 24, borderRadius: 4 }
});
