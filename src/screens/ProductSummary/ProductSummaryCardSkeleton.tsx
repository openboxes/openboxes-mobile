import React from 'react';
import { StyleSheet, View } from 'react-native';

import LayoutStyle from '../../assets/styles/LayoutStyle';
import { ShimmerBlock } from '../../components/ContentSkeleton';

export default function ProductSummaryCardSkeleton() {
  return (
    <View style={[LayoutStyle.listItemContainer, styles.card]}>
      <View style={styles.headerRow}>
        <ShimmerBlock style={styles.chipLarge} />
      </View>
      <View style={styles.divider} />
      <ShimmerBlock style={styles.title} />
      <View style={styles.footerRow}>
        <ShimmerBlock style={styles.chipWide} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: '#F5F6F8', padding: 14 },
  headerRow: { flexDirection: 'row' },
  footerRow: { flexDirection: 'row', marginTop: 10 },
  divider: { height: 1, backgroundColor: '#E0E0E0', marginVertical: 10 },
  chipLarge: { width: 120, height: 24, borderRadius: 12 },
  chipWide: { width: '80%', height: 22, borderRadius: 11 },
  title: { width: '70%', height: 16, borderRadius: 4 }
});
