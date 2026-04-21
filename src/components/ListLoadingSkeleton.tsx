import React, { ComponentType } from 'react';
import { View } from 'react-native';

import { CardSkeleton } from './ContentSkeleton';

interface Props {
  visible: boolean;
  count?: number;
  CardComponent?: ComponentType<any>;
}

export default function ListLoadingSkeleton({
  visible,
  count = 5,
  CardComponent = CardSkeleton
}: Props) {
  if (!visible) {
    return null;
  }
  return (
    <View>
      {Array.from({ length: count }).map((_, i) => (
        <CardComponent key={i} />
      ))}
    </View>
  );
}
