import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useMemo, useState } from 'react';
import { FlatList, ScrollView, View } from 'react-native';
import { Chip } from 'react-native-paper';
import { useDispatch } from 'react-redux';

import BarcodeSearchHeader from '../../components/BarcodeSearchHeader/BarcodeSearchHeader';
import EmptyView from '../../components/EmptyView';
import ListLoadingSkeleton from '../../components/ListLoadingSkeleton';
import { navigate } from '../../NavigationService';
import { getOpenPickTasksAction } from '../../redux/actions/picking';
import { DiscretePickingOrder, PickTask } from '../../types/picking';
import { emptyStateMessage } from '../../utils/emptyStateMessage';
import { usePickingContext } from './PickingContext';
import { DELIVERY_TYPES } from './constants';
import DiscretePickingCardSkeleton from './DiscretePickingCardSkeleton';
import DiscretePickingOrderCard from './DiscretePickingOrderCard';
import {
  ALL_QUEUE_TYPES,
  filterOrders,
  groupTasksIntoOrders,
  QueueTypeFilter,
  queueChipCounts,
  sortOrders
} from './discretePickingLib';
import styles from './discretePickingStyles';

export default function DiscretePickingListScreen() {
  const dispatch = useDispatch();
  const { startOrderSession } = usePickingContext();

  const [tasks, setTasks] = useState<PickTask[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedQueueType, setSelectedQueueType] = useState<QueueTypeFilter>(ALL_QUEUE_TYPES);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [hasLoaded, setHasLoaded] = useState<boolean>(false);

  const fetchOrders = useCallback(() => {
    setIsRefreshing(true);
    dispatch(
      getOpenPickTasksAction(({ response, errorMessage }) => {
        if (!errorMessage && response?.data) {
          setTasks(response.data);
        }
        setIsRefreshing(false);
        setHasLoaded(true);
      })
    );
  }, [dispatch]);

  useFocusEffect(
    useCallback(() => {
      fetchOrders();
    }, [fetchOrders])
  );

  // Group tasks into orders and sort by priority once per fetch.
  const sortedOrders = useMemo(() => sortOrders(groupTasksIntoOrders(tasks)), [tasks]);

  // Chip counts are derived from the full (unfiltered) order list.
  const counts = useMemo(() => queueChipCounts(sortedOrders), [sortedOrders]);

  // Real-time filter by search term and selected queue type.
  const visibleOrders = useMemo(
    () => filterOrders(sortedOrders, { search: searchTerm, queueType: selectedQueueType }),
    [sortedOrders, searchTerm, selectedQueueType]
  );

  const handleOrderPress = (order: DiscretePickingOrder) => {
    startOrderSession(order.requisitionId).then((success) => {
      if (success) {
        navigate('PickingPickLocation');
      }
    });
  };

  const chips: { value: QueueTypeFilter; label: string; count: number }[] = [
    { value: ALL_QUEUE_TYPES, label: 'All', count: sortedOrders.length },
    ...DELIVERY_TYPES.map((type) => ({ value: type.code, label: type.label, count: counts[type.code] ?? 0 }))
  ];

  return (
    <View style={styles.screenContainer}>
      <BarcodeSearchHeader
        searchBox
        autoSearch
        placeholder="Search by order, customer, or product"
        resetSearch={() => setSearchTerm('')}
        accessibilityLabel="Search open orders"
        onSearchTermSubmit={setSearchTerm}
      />

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.chipRow}
        contentContainerStyle={styles.chipRowContent}
        keyboardShouldPersistTaps="handled"
      >
        {chips.map((chip) => {
          const selected = chip.value === selectedQueueType;
          return (
            <Chip
              key={chip.value}
              selected={selected}
              style={[styles.queueChip, selected && styles.queueChipSelected]}
              textStyle={[styles.queueChipText, selected && styles.queueChipTextSelected]}
              onPress={() => setSelectedQueueType(chip.value)}
            >
              {`${chip.label} (${chip.count})`}
            </Chip>
          );
        })}
      </ScrollView>

      {!hasLoaded ? (
        <ListLoadingSkeleton visible count={5} CardComponent={DiscretePickingCardSkeleton} />
      ) : (
        <FlatList
          data={visibleOrders}
          keyExtractor={(order) => order.requisitionId}
          renderItem={({ item }) => <DiscretePickingOrderCard order={item} onPress={handleOrderPress} />}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          contentContainerStyle={styles.listContent}
          ItemSeparatorComponent={() => <View style={styles.itemSeparator} />}
          refreshing={isRefreshing}
          ListEmptyComponent={
            <EmptyView
              title="Orders"
              description={emptyStateMessage('orders', searchTerm, 'No open orders ready for picking')}
            />
          }
          onRefresh={fetchOrders}
        />
      )}
    </View>
  );
}
