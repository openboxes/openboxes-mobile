import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Card } from 'react-native-paper';

import { ShimmerBlock } from '../../components/ContentSkeleton';
import Theme from '../../utils/Theme';

export default function LocationCardSkeleton() {
  return (
    <Card style={styles.cardContainer}>
      <Card.Content style={styles.cardContent}>
        <View style={styles.contentContainer}>
          <ShimmerBlock style={styles.icon} />
          <View style={styles.textContainer}>
            <ShimmerBlock style={styles.title} />
            <ShimmerBlock style={styles.subtitle} />
          </View>
        </View>
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    marginHorizontal: Theme.spacing.small / 4,
    marginVertical: Theme.spacing.small
  },
  cardContent: { flexDirection: 'row' },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    padding: Theme.spacing.medium
  },
  textContainer: {
    marginLeft: Theme.spacing.large,
    justifyContent: 'center',
    alignItems: 'flex-start',
    flex: 1
  },
  icon: { width: 48, height: 48, borderRadius: 8 },
  title: { width: '65%', height: 16, borderRadius: 4, marginBottom: 8 },
  subtitle: { width: '40%', height: 12, borderRadius: 4 }
});
