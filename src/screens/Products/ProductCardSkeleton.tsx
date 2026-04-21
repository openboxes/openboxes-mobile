import React from 'react';
import { StyleSheet, View } from 'react-native';

import LayoutStyle from '../../assets/styles/LayoutStyle';
import { ShimmerBlock } from '../../components/ContentSkeleton';

export default function ProductCardSkeleton() {
  return (
    <View style={[LayoutStyle.listItemContainer, styles.card]}>
      <View style={styles.headerRow}>
        <ShimmerBlock style={styles.chipLarge} />
      </View>
      <ShimmerBlock style={styles.lineLarge} />
      <View style={styles.footerRow}>
        <ShimmerBlock style={styles.chipSmall} />
        <ShimmerBlock style={styles.chipMedium} />
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
    marginBottom: 8
  },
  footerRow: {
    flexDirection: 'row',
    marginTop: 10
  },
  chipLarge: { width: 110, height: 22, borderRadius: 11 },
  chipMedium: { width: 90, height: 22, borderRadius: 11, marginLeft: 8 },
  chipSmall: { width: 70, height: 22, borderRadius: 11 },
  lineLarge: { width: '70%', height: 16, borderRadius: 4, marginTop: 4 }
});
