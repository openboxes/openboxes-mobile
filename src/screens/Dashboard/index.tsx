import React, { useCallback } from 'react';
import { FlatList, ListRenderItemInfo, Text, View } from 'react-native';
import { useSelector } from 'react-redux';

import EmptyIcon from '../../assets/images/icon_empty.svg';
import Button from '../../components/Button';
import { useFilteredDashboardEntries } from '../../hooks/useFilteredDashboardEntries';
import { useOrderedDashboardEntries } from '../../hooks/useOrderedDashboardEntries';
import { useResponsiveColumns } from '../../hooks/useResponsiveColumns';
import { RootState } from '../../redux/reducers';
import { DashboardCard } from './DashboardCard';
import { DashboardEntry } from './dashboardData';
import styles from './styles';
import type { Props } from './Types';

export default function Dashboard({ navigation }: Props) {
  const { dashboardEntriesVisibility, dashboardEntriesOrder } = useSelector(
    (state: RootState) => state.settingsReducer
  );

  const orderedEntries = useOrderedDashboardEntries(dashboardEntriesOrder);
  const visibleEntries = useFilteredDashboardEntries(orderedEntries, dashboardEntriesVisibility);
  const { columns } = useResponsiveColumns();

  const renderItem = useCallback(({ item }: ListRenderItemInfo<DashboardEntry>) => <DashboardCard item={item} />, []);

  return (
    <View style={styles.screenContainer}>
      <FlatList
        key={columns}
        data={visibleEntries}
        renderItem={renderItem}
        keyExtractor={(item: DashboardEntry, index: number) =>
          item.key || item.navigationScreenName || `dashboard-item-${index}`
        }
        numColumns={columns}
        contentContainerStyle={styles.flatListContentContainer}
        ListEmptyComponent={() => (
          <View style={styles.emptyScreenContainer}>
            <EmptyIcon />
            <Text style={styles.emptyScreenTitle}>No Dashboard Entries</Text>
            <Text style={styles.emptyScreenDescription}>Please check your settings to enable dashboard entries.</Text>
            <Button
              style={styles.emptyScreenButton}
              title="Go To Settings"
              mode="contained"
              onPress={() => navigation.navigate('Settings')}
            />
          </View>
        )}
      />
    </View>
  );
}
