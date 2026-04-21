import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Card } from 'react-native-paper';

import LayoutStyle from '../../assets/styles/LayoutStyle';
import { ShimmerBlock } from '../../components/ContentSkeleton';

export default function ProductSummaryCardSkeleton() {
  return (
    <Card style={LayoutStyle.listItemContainer}>
      <Card.Content>
        <View style={styles.headerRow}>
          <ShimmerBlock style={styles.codeChip} />
        </View>
        <View style={styles.divider} />
        <ShimmerBlock style={styles.name} />
        <View style={styles.footerRow}>
          <ShimmerBlock style={styles.quantityChip} />
        </View>
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  headerRow: { flexDirection: 'row' },
  divider: { height: 1, backgroundColor: '#E0E0E0', marginVertical: 8 },
  footerRow: { flexDirection: 'row', marginTop: 8 },
  codeChip: { width: 150, height: 24, borderRadius: 4 },
  name: { width: '80%', height: 16, borderRadius: 4 },
  quantityChip: { width: 200, height: 24, borderRadius: 4 }
});
