import React from 'react';
import { StyleSheet, View } from 'react-native';

import LayoutStyle from '../../assets/styles/LayoutStyle';
import { ShimmerBlock } from '../../components/ContentSkeleton';

export default function PutawayItemCardSkeleton() {
  return (
    <View style={[LayoutStyle.listItemContainer, styles.card]}>
      <View style={styles.headerRow}>
        <ShimmerBlock style={styles.chipMedium} />
        <ShimmerBlock style={styles.chipMedium} />
      </View>
      <View style={styles.divider} />
      <ShimmerBlock style={styles.title} />
      <ShimmerBlock style={styles.subtitle} />
      <View style={styles.footerRow}>
        <ShimmerBlock style={styles.chipSmall} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: '#F5F6F8', padding: 14 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  footerRow: { flexDirection: 'row', marginTop: 10 },
  divider: { height: 1, backgroundColor: '#E0E0E0', marginVertical: 10 },
  chipMedium: { width: 100, height: 22, borderRadius: 11 },
  chipSmall: { width: 85, height: 20, borderRadius: 10 },
  title: { width: '55%', height: 14, borderRadius: 4, marginBottom: 6 },
  subtitle: { width: '70%', height: 12, borderRadius: 4 }
});
