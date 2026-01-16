import React, { useCallback } from 'react';
import { FlatList, ListRenderItemInfo, Text, View } from 'react-native';
import { Card } from 'react-native-paper';

import { useResponsiveColumns } from '../../hooks/useResponsiveColumns';
import { navigateToDashboardEntry } from '../../NavigationService';
import { DashboardEntry } from './dashboardData';
import styles from './styles';

export type SubroutesEntriesParams = {
  subroutes: DashboardEntry[];
  subroutesScreenName?: string;
};

type SubroutesEntriesProps = {
  route: {
    params: SubroutesEntriesParams;
  };
};

export default function SubroutesEntries({ route }: SubroutesEntriesProps) {
  const { subroutes } = route.params || {};
  const { columns } = useResponsiveColumns();

  const renderItem = useCallback(({ item }: ListRenderItemInfo<DashboardEntry>) => {
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
  }, []);

  return (
    <View style={styles.screenContainer}>
      <FlatList
        key={columns}
        data={subroutes}
        renderItem={renderItem}
        keyExtractor={(item: DashboardEntry, index: number) =>
          item.key || item.navigationScreenName || `subroute-item-${index}`
        }
        numColumns={columns}
        contentContainerStyle={styles.flatListContentContainer}
      />
    </View>
  );
}
