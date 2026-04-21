import React from 'react';
import { StyleSheet, View } from 'react-native';

import LayoutStyle from '../../assets/styles/LayoutStyle';
import { ShimmerBlock } from '../../components/ContentSkeleton';

export default function LocationCardSkeleton() {
  return (
    <View style={[LayoutStyle.listItemContainer, styles.card]}>
      <ShimmerBlock style={styles.title} />
      <ShimmerBlock style={styles.subtitle} />
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: '#F5F6F8', padding: 16 },
  title: { width: '65%', height: 16, borderRadius: 4, marginBottom: 8 },
  subtitle: { width: '40%', height: 12, borderRadius: 4 }
});
