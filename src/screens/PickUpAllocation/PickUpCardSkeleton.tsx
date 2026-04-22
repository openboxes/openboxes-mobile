import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Card } from 'react-native-paper';

import { ShimmerBlock, SkeletonDivider } from '../../components/ContentSkeleton';
import Theme from '../../utils/Theme';

export default function PickUpCardSkeleton() {
  return (
    <View style={styles.wrapper}>
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.headerRow}>
            <ShimmerBlock style={styles.identifier} />
            <ShimmerBlock style={styles.linesChip} />
          </View>
          <SkeletonDivider />
          <ShimmerBlock style={styles.title} />
          <ShimmerBlock style={styles.caption} />
        </Card.Content>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: Theme.spacing.small - 2
  },
  card: {
    borderRadius: Theme.roundness,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ddd'
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Theme.spacing.small - 2
  },
  identifier: { width: 140, height: 24, borderRadius: Theme.roundness },
  linesChip: { width: 90, height: 24, borderRadius: Theme.roundness },
  title: { width: '65%', height: 20, borderRadius: 4, marginTop: 4, marginBottom: 6 },
  caption: { width: '55%', height: 12, borderRadius: 4 }
});
