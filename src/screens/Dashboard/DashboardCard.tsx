import React from 'react';
import { Text, View } from 'react-native';
import { Card } from 'react-native-paper';

import { navigateToDashboardEntry } from '../../NavigationService';
import { DashboardEntry } from './dashboardData';
import styles from './styles';

type DashboardCardProps = {
  item: DashboardEntry;
};

export const DashboardCard = ({ item }: DashboardCardProps) => {
  const IconComponent = item.icon;
  const onPress = () => navigateToDashboardEntry(item);

  return (
    <Card style={styles.cardContainer} onPress={onPress}>
      <Card.Content style={styles.cardContent}>
        <View style={styles.iconWrapper}>
          {IconComponent && <IconComponent width={styles.icon.width} height={styles.icon.height} />}
        </View>
        <Text style={styles.cardLabel}>{item.screenName}</Text>
      </Card.Content>
    </Card>
  );
};
