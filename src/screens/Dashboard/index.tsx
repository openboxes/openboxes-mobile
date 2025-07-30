import React, { useCallback } from 'react';
import { FlatList, ListRenderItemInfo, Text, View } from 'react-native';
import { Card } from 'react-native-paper';
import { useSelector } from 'react-redux';

import EmptyIcon from '../../assets/images/icon_empty.svg';
import Button from '../../components/Button';
import { useFilteredDashboardEntries } from '../../hooks/useFilteredDashboardEntries';
import { useOrderedDashboardEntries } from '../../hooks/useOrderedDashboardEntries';
import { RootState } from '../../redux/reducers';
import { DashboardEntry } from './dashboardData';
import styles from './styles';
import type { Props } from './Types';

export default function Dashboard({ navigation }: Props) {
  const { dashboardEntriesVisibility, dashboardEntriesOrder } = useSelector(
    (state: RootState) => state.settingsReducer
  );

  const orderedEntries = useOrderedDashboardEntries(dashboardEntriesOrder);
  const visibleEntries = useFilteredDashboardEntries(orderedEntries, dashboardEntriesVisibility);

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<DashboardEntry>) => {
      const IconComponent = item.icon;
      return (
        <Card style={styles.cardContainer} onPress={() => navigation.navigate(item.navigationScreenName)}>
          <Card.Content style={styles.cardContent}>
            <View style={styles.iconWrapper}>
              {IconComponent && <IconComponent width={styles.icon.width} height={styles.icon.height} />}
            </View>
            <Text style={styles.cardLabel}>{item.screenName}</Text>
          </Card.Content>
        </Card>
      );
    },
    [navigation]
  );

  return (
    <View style={styles.screenContainer}>
      <FlatList
        data={visibleEntries}
        renderItem={renderItem}
        keyExtractor={(item: DashboardEntry, index: number) =>
          item.key || item.navigationScreenName || `dashboard-item-${index}`
        }
        numColumns={2}
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
