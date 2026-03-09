import React from 'react';
import { Text, useWindowDimensions, View } from 'react-native';
import { Card } from 'react-native-paper';

import { navigateToDashboardEntry } from '../../NavigationService';
import Theme from '../../utils/Theme';
import { DashboardEntry } from './dashboardData';
import styles from './styles';

type DashboardCardProps = {
  item: DashboardEntry;
  columns: number;
};

export const DashboardCard = ({ item, columns }: DashboardCardProps) => {
  const IconComponent = item.icon;
  const onPress = () => navigateToDashboardEntry(item);
  const { width } = useWindowDimensions();
  const margin = Theme.spacing.small / 2;
  const padding = Theme.spacing.small / 2;
  const cardStyle =
    columns === 1
      ? [styles.cardContainer, { flex: 1 }]
      : [styles.cardContainer, { width: (width - padding * 2) / columns - margin * 2 }];

  return (
    <Card style={cardStyle} onPress={onPress}>
      <Card.Content style={styles.cardContent}>
        <View style={styles.iconWrapper}>
          {IconComponent && <IconComponent width={styles.icon.width} height={styles.icon.height} />}
        </View>
        <Text style={styles.cardLabel}>{item.screenName}</Text>
      </Card.Content>
    </Card>
  );
};
