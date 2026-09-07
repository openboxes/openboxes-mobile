import React from 'react';
import { View } from 'react-native';

import { ShimmerBlock } from '../../components/ContentSkeleton';
import { DeliveryTypeCode } from '../../types/picking';
import { DELIVERY_TYPES } from './constants';
import styles from './styles';

export default function PickingPickTypeSkeleton() {
  return (
    <>
      <View style={styles.optionsCard}>
        {DELIVERY_TYPES.map((item, index) => {
          const isLast = index === DELIVERY_TYPES.length - 1;
          const hasPriorityLabel = item.code !== DeliveryTypeCode.DEFAULT;

          return (
            <View key={item.label} style={[styles.optionRow, isLast && styles.optionRowLast]}>
              <ShimmerBlock style={styles.radioSkeleton} />

              <View style={styles.optionRowContent}>
                <View>
                  <ShimmerBlock style={styles.optionTitleSkeleton} />
                  {hasPriorityLabel ? <ShimmerBlock style={styles.optionSubtitleSkeleton} /> : null}
                </View>

                <View style={styles.countWrapper}>
                  <ShimmerBlock style={styles.countValueSkeleton} />
                  <ShimmerBlock style={styles.countCaptionSkeleton} />
                </View>
              </View>
            </View>
          );
        })}
      </View>

      <View style={styles.formWrapper}>
        <ShimmerBlock style={[styles.marginTopSmall, styles.inputSkeleton]} />
        <ShimmerBlock style={[styles.marginTop, styles.buttonSkeleton]} />
      </View>
    </>
  );
}
