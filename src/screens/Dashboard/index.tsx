import React, { useCallback, useMemo } from 'react';
import { FlatList, ListRenderItemInfo, ScrollView, Text, View } from 'react-native';
import { useSelector } from 'react-redux';

import EmptyIcon from '../../assets/images/icon_empty.svg';
import Button from '../../components/Button';
import { useFilteredDashboardEntries } from '../../hooks/useFilteredDashboardEntries';
import { useOrderedDashboardEntries } from '../../hooks/useOrderedDashboardEntries';
import { useResponsiveColumns } from '../../hooks/useResponsiveColumns';
import { RootState } from '../../redux/reducers';
import { DashboardCard } from './DashboardCard';
import {
  DashboardEntry,
  DashboardGroup,
  GROUP_ORDER,
  getDashboardEntriesByGroup,
  getGroupDisplayName
} from './dashboardData';
import styles from './styles';
import type { Props } from './Types';

type DashboardGroupSectionProps = {
  group: DashboardGroup;
  entries: DashboardEntry[];
  columns: number;
};

function DashboardGroupSection({ group, entries, columns }: DashboardGroupSectionProps) {
  const renderItem = useCallback(({ item }: ListRenderItemInfo<DashboardEntry>) => <DashboardCard item={item} />, []);

  if (entries.length === 0) {
    return null;
  }

  return (
    <View style={styles.groupSection}>
      <Text style={styles.groupHeader}>{getGroupDisplayName(group as DashboardGroup)}</Text>
      <FlatList
        key={`${group}-${columns}`}
        data={entries}
        renderItem={renderItem}
        keyExtractor={(item: DashboardEntry, index: number) =>
          item.key || item.navigationScreenName || `dashboard-item-${index}`
        }
        numColumns={columns}
        scrollEnabled={false}
        contentContainerStyle={styles.flatListContentContainer}
      />
    </View>
  );
}

export default function Dashboard({ navigation }: Props) {
  const { dashboardEntriesVisibility, dashboardEntriesOrder } = useSelector(
    (state: RootState) => state.settingsReducer
  );

  const orderedEntries = useOrderedDashboardEntries(dashboardEntriesOrder);
  const visibleEntries = useFilteredDashboardEntries(orderedEntries, dashboardEntriesVisibility);
  const { columns } = useResponsiveColumns();

  const groupedEntries = useMemo(() => {
    const groups: { [key: string]: DashboardEntry[] } = {};
    GROUP_ORDER.forEach((group) => {
      groups[group] = getDashboardEntriesByGroup(group).filter((entry) =>
        visibleEntries.some((visible) => visible.key === entry.key)
      );
    });
    return groups;
  }, [visibleEntries]);

  const hasAnyEntries = GROUP_ORDER.some((group) => groupedEntries[group].length > 0);

  if (!hasAnyEntries) {
    return (
      <View style={styles.screenContainer}>
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
      </View>
    );
  }

  return (
    <ScrollView style={styles.screenContainer}>
      {GROUP_ORDER.map((group) => (
        <DashboardGroupSection key={group} group={group} entries={groupedEntries[group]} columns={columns} />
      ))}
    </ScrollView>
  );
}
