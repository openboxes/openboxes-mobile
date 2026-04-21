import React from 'react';
import { StyleSheet, View } from 'react-native';

import LayoutStyle from '../../assets/styles/LayoutStyle';
import { ShimmerBlock } from '../../components/ContentSkeleton';

export default function OrderCardSkeleton() {
  return (
    <View style={[LayoutStyle.listItemContainer, styles.card]}>
      <View style={styles.headerRow}>
        <ShimmerBlock style={styles.chipLarge} />
        <ShimmerBlock style={styles.chipSmall} />
      </View>
      <View style={styles.divider} />
      <ShimmerBlock style={styles.lineMedium} />
      <ShimmerBlock style={styles.lineShort} />
      <View style={styles.footerRow}>
        <ShimmerBlock style={styles.columnHalf} />
        <ShimmerBlock style={styles.columnHalf} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#F5F6F8',
    padding: 14
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10
  },
  divider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: 10
  },
  chipLarge: { width: 120, height: 24, borderRadius: 12 },
  chipSmall: { width: 80, height: 24, borderRadius: 12 },
  lineMedium: { width: '65%', height: 14, borderRadius: 4, marginBottom: 8 },
  lineShort: { width: '40%', height: 12, borderRadius: 4 },
  columnHalf: { width: '45%', height: 12, borderRadius: 4 }
});
