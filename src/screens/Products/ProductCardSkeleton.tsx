import React from 'react';
import { StyleSheet, View } from 'react-native';

import LayoutStyle from '../../assets/styles/LayoutStyle';
import { ShimmerBlock } from '../../components/ContentSkeleton';

export default function ProductCardSkeleton() {
  return (
    <View style={[LayoutStyle.listItemContainer, styles.card]}>
      <View style={styles.headerRow}>
        <ShimmerBlock style={styles.chipCode} />
      </View>
      <View style={styles.divider} />
      <ShimmerBlock style={styles.name} />
      <View style={styles.footerRow}>
        <ShimmerBlock style={styles.chipBarcode} />
        <ShimmerBlock style={styles.chipCategory} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: '#FFFFFF', padding: 14 },
  headerRow: { flexDirection: 'row' },
  divider: { height: 1, backgroundColor: '#E0E0E0', marginVertical: 10 },
  footerRow: { flexDirection: 'row', marginTop: 10, flexWrap: 'wrap' },
  chipCode: { width: 160, height: 24, borderRadius: 4 },
  name: { width: '75%', height: 16, borderRadius: 4 },
  chipBarcode: { width: 130, height: 24, borderRadius: 4, marginRight: 8 },
  chipCategory: { width: 110, height: 24, borderRadius: 4 }
});
