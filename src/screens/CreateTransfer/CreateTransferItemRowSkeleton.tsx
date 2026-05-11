import React from 'react';
import { View } from 'react-native';

import { ShimmerBlock } from '../../components/ContentSkeleton';
import styles from './styles';

export default function CreateTransferItemRowSkeleton() {
  return (
    <View style={styles.candidateRow}>
      <View style={styles.candidateRowMain}>
        <View style={styles.candidateColProduct}>
          <ShimmerBlock style={styles.skeletonLineWide} />
          <ShimmerBlock style={styles.skeletonLineNarrow} />
        </View>
        <View style={styles.candidateColBin}>
          <ShimmerBlock style={styles.skeletonLineWide} />
          <ShimmerBlock style={styles.skeletonLineNarrow} />
        </View>
        <View style={styles.candidateColQty}>
          <ShimmerBlock style={styles.skeletonLineQty} />
        </View>
      </View>
    </View>
  );
}
