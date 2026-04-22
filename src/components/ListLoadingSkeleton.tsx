import React, { ComponentType } from 'react';
import { StyleSheet, View } from 'react-native';

import { CardSkeleton } from './ContentSkeleton';

interface Props {
  visible: boolean;
  count?: number;
  CardComponent?: ComponentType<any>;
}

export default function ListLoadingSkeleton({ visible, count = 5, CardComponent = CardSkeleton }: Props) {
  if (!visible) {
    return null;
  }
  return (
    <View style={styles.container}>
      {Array.from({ length: count }).map((_, i) => (
        <CardComponent key={i} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignSelf: 'stretch'
  }
});
