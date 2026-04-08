import React, { useEffect, useRef } from 'react';
import { Animated, View } from 'react-native';
import styles from './styles';

function SkeletonRow() {
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 1, duration: 600, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.3, duration: 600, useNativeDriver: true })
      ])
    );
    animation.start();
    return () => animation.stop();
  }, [opacity]);

  return (
    <Animated.View style={[styles.skeletonRow, { opacity }]}>
      <View style={styles.skeletonLabel} />
      <View style={styles.skeletonSubtitle} />
    </Animated.View>
  );
}

export function SkeletonList() {
  return (
    <View style={styles.skeletonContainer}>
      <SkeletonRow />
      <SkeletonRow />
      <SkeletonRow />
    </View>
  );
}
