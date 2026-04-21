import React from 'react';
import { StyleSheet, View } from 'react-native';

import LayoutStyle from '../../assets/styles/LayoutStyle';
import { ShimmerBlock } from '../../components/ContentSkeleton';

export default function PutawayCandidateCardSkeleton() {
  return (
    <View style={[LayoutStyle.listItemContainer, styles.card]}>
      <View style={styles.row}>
        <ShimmerBlock style={styles.chipMedium} />
      </View>
      <View style={styles.divider} />
      <ShimmerBlock style={styles.title} />
      <ShimmerBlock style={styles.subtitle} />
      <View style={styles.footerRow}>
        <ShimmerBlock style={styles.chipSmall} />
        <ShimmerBlock style={styles.chipSmall} />
        <ShimmerBlock style={styles.chipSmall} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: '#F5F6F8', padding: 14 },
  row: { flexDirection: 'row' },
  footerRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
  divider: { height: 1, backgroundColor: '#E0E0E0', marginVertical: 10 },
  chipMedium: { width: 110, height: 24, borderRadius: 12 },
  chipSmall: { width: 85, height: 20, borderRadius: 10 },
  title: { width: '55%', height: 14, borderRadius: 4, marginBottom: 6 },
  subtitle: { width: '70%', height: 12, borderRadius: 4 }
});
