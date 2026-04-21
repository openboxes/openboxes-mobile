import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Card } from 'react-native-paper';

import LayoutStyle from '../../assets/styles/LayoutStyle';
import { ShimmerBlock } from '../../components/ContentSkeleton';

export default function PickUpCardSkeleton() {
  return (
    <Card style={LayoutStyle.listItemContainer}>
      <Card.Content>
        <View style={styles.headerRow}>
          <ShimmerBlock style={styles.identifier} />
          <ShimmerBlock style={styles.linesChip} />
        </View>
        <View style={styles.divider} />
        <ShimmerBlock style={styles.title} />
        <ShimmerBlock style={styles.caption} />
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  divider: { height: 1, backgroundColor: '#E0E0E0', marginVertical: 8 },
  identifier: { width: 140, height: 24, borderRadius: 4 },
  linesChip: { width: 90, height: 24, borderRadius: 4 },
  title: { width: '65%', height: 18, borderRadius: 4, marginTop: 4, marginBottom: 6 },
  caption: { width: '55%', height: 12, borderRadius: 4 }
});
