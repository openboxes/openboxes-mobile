import React, { useCallback } from 'react';
import { FlatList, ListRenderItemInfo, View } from 'react-native';

import { useResponsiveColumns } from '../../hooks/useResponsiveColumns';
import { DashboardCard } from './DashboardCard';
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

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<DashboardEntry>) => <DashboardCard item={item} columns={columns} />,
    [columns]
  );

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
