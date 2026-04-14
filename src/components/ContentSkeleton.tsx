import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import Theme from '../utils/Theme';

function ShimmerBlock({ style }: { style?: any }) {
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

  return <Animated.View style={[styles.block, style, { opacity }]} />;
}

/** Skeleton for a product-details header section (chip + title + detail chips). */
export function ProductDetailsSkeleton() {
  return (
    <View style={styles.detailsContainer}>
      <ShimmerBlock style={styles.chip} />
      <View style={styles.divider} />
      <ShimmerBlock style={styles.title} />
      <ShimmerBlock style={styles.chipWide} />
      <ShimmerBlock style={styles.chipWide} />
      <ShimmerBlock style={styles.chipWide} />
    </View>
  );
}

/** Skeleton for a form section (inputs + button). */
export function FormSkeleton() {
  return (
    <View style={styles.formContainer}>
      <ShimmerBlock style={styles.input} />
      <ShimmerBlock style={styles.input} />
      <ShimmerBlock style={styles.button} />
    </View>
  );
}

/** Skeleton for a card-based list item. */
export function CardSkeleton() {
  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <ShimmerBlock style={styles.chip} />
        <ShimmerBlock style={styles.chipSmall} />
      </View>
      <View style={styles.divider} />
      <ShimmerBlock style={styles.cardTitle} />
      <ShimmerBlock style={styles.chipWide} />
      <ShimmerBlock style={styles.chipWide} />
    </View>
  );
}

/** Full-page skeleton for Transfer / AdjustStock screens. */
export function DetailFormSkeleton() {
  return (
    <View style={styles.wrapper}>
      <ProductDetailsSkeleton />
      <FormSkeleton />
    </View>
  );
}

/** Full-page skeleton for TransfersDetails screen. */
export function TransferDetailsSkeleton() {
  return (
    <View style={styles.wrapper}>
      <ProductDetailsSkeleton />
      <View style={styles.listContainer}>
        <CardSkeleton />
        <CardSkeleton />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1
  },
  detailsContainer: {
    backgroundColor: Theme.colors.surface,
    padding: Theme.spacing.large
  },
  formContainer: {
    padding: Theme.spacing.large
  },
  listContainer: {
    padding: Theme.spacing.large
  },
  block: {
    backgroundColor: '#DFE1E5',
    borderRadius: 4
  },
  divider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: 8
  },
  chip: {
    width: 100,
    height: 28,
    borderRadius: 4
  },
  chipSmall: {
    width: 70,
    height: 28,
    borderRadius: 4
  },
  chipWide: {
    width: '80%',
    height: 28,
    borderRadius: 4,
    marginTop: Theme.spacing.small
  },
  title: {
    width: '60%',
    height: 20,
    borderRadius: 4,
    marginBottom: 4
  },
  input: {
    width: '100%',
    height: 56,
    borderRadius: 4,
    marginBottom: Theme.spacing.small
  },
  button: {
    width: '100%',
    height: 44,
    borderRadius: 4,
    marginTop: Theme.spacing.small
  },
  card: {
    backgroundColor: '#F5F6F8',
    borderRadius: 8,
    borderWidth: 0.5,
    borderColor: '#E0E0E0',
    padding: Theme.spacing.large,
    marginBottom: Theme.spacing.small
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  cardTitle: {
    width: '50%',
    height: 18,
    borderRadius: 4,
    marginBottom: 4
  }
});
