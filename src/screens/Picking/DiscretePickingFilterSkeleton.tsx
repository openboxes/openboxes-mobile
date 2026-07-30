import React from 'react';
import { View } from 'react-native';

import { ShimmerBlock } from '../../components/ContentSkeleton';
import { DELIVERY_TYPES } from './constants';
import styles from './discretePickingStyles';

const CHIP_WIDTHS = ['All', ...DELIVERY_TYPES.map((type) => type.label)].map((label) => label.length * 7 + 46);

export default function DiscretePickingFilterSkeleton() {
  return (
    <View style={[styles.filterRowContent, styles.filterSkeletonRow]}>
      {CHIP_WIDTHS.map((width, index) => (
        <ShimmerBlock key={index} style={[styles.filterChipSkeleton, { width }]} />
      ))}
    </View>
  );
}
