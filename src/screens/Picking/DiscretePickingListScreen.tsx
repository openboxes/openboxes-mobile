import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { FlatList, ScrollView, View } from 'react-native';
import { Chip, Text } from 'react-native-paper';
import { useDispatch } from 'react-redux';

import BarcodeSearchHeader from '../../components/BarcodeSearchHeader/BarcodeSearchHeader';
import EmptyView from '../../components/EmptyView';
import ListLoadingSkeleton from '../../components/ListLoadingSkeleton';
import PullToRefreshControl from '../../components/PullToRefreshControl';
import { navigate } from '../../NavigationService';
import { getOpenPickTasksAction } from '../../redux/actions/picking';
import { DiscretePickingOrder, PickTask } from '../../types/picking';
import { emptyStateMessage } from '../../utils/emptyStateMessage';
import { ToggleRow } from '../Dashboard/ToggleRow';
import { DELIVERY_TYPES } from './constants';
import DiscretePickingCardSkeleton from './DiscretePickingCardSkeleton';
import DiscretePickingFilterSkeleton from './DiscretePickingFilterSkeleton';
import {
  ALL_QUEUE_TYPES,
  filterOrders,
  groupTasksIntoOrders,
  queueChipCounts,
  QueueTypeFilter,
  sortOrders
} from './discretePickingLib';
import DiscretePickingOrderCard from './DiscretePickingOrderCard';
import styles from './discretePickingStyles';
import { usePickingContext } from './PickingContext';

export default function DiscretePickingListScreen() {
  const dispatch = useDispatch();
  const { startOrderSession } = usePickingContext();

  const [tasks, setTasks] = useState<PickTask[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedQueueType, setSelectedQueueType] = useState<QueueTypeFilter>(ALL_QUEUE_TYPES);
  const [excludeAssignedRequisitions, setExcludeAssignedRequisitions] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [hasLoaded, setHasLoaded] = useState<boolean>(false);
  const [isStartingOrder, setIsStartingOrder] = useState<boolean>(false);
  // takeLatest cancels a superseded pull without its callback, so any completion settles it
  const pendingPullDone = useRef<() => void>();

  const fetchOrders = useCallback(
    (excludeAssignedRequisitionsParam: boolean, done?: () => void) => {
      if (done) {
        pendingPullDone.current = done;
      } else {
        setIsRefreshing(true);
      }
      dispatch(
        getOpenPickTasksAction(excludeAssignedRequisitionsParam, ({ response, errorMessage }) => {
          if (!errorMessage && response?.data) {
            setTasks(response.data);
          }
          setIsRefreshing(false);
          setHasLoaded(true);
          pendingPullDone.current?.();
          pendingPullDone.current = undefined;
        })
      );
    },
    [dispatch]
  );

  useFocusEffect(
    useCallback(() => {
      setIsStartingOrder(false);
      fetchOrders(excludeAssignedRequisitions);
    }, [fetchOrders, excludeAssignedRequisitions])
  );

  const sortedOrders = useMemo(() => sortOrders(groupTasksIntoOrders(tasks)), [tasks]);

  const counts = useMemo(() => queueChipCounts(sortedOrders), [sortedOrders]);

  const visibleOrders = useMemo(
    () => filterOrders(sortedOrders, { search: searchTerm, queueType: selectedQueueType }),
    [sortedOrders, searchTerm, selectedQueueType]
  );

  const handleOrderPress = (order: DiscretePickingOrder) => {
    // startOrderSession shows a full-screen loader, so suppress the search bar spinner.
    setIsStartingOrder(true);
    startOrderSession(order.requisitionId).then((success) => {
      if (success) {
        navigate('PickingPickLocation');
        return;
      }
      setIsStartingOrder(false);
    });
  };

  // Skeleton covers the first load only, later refreshes keep the list on screen.
  const isLoadingList = !hasLoaded;

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
        loading={hasLoaded && isRefreshing && !isStartingOrder}
        onSearchTermSubmit={setSearchTerm}
      />

      <View style={styles.filterBar}>
        {isLoadingList ? (
          <DiscretePickingFilterSkeleton />
        ) : (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.filterRow}
            contentContainerStyle={styles.filterRowContent}
            keyboardShouldPersistTaps="handled"
          >
            {chips.map((chip) => {
              const selected = chip.value === selectedQueueType;
              const textStyle = [styles.filterChipText, selected && styles.filterChipTextSelected];
              return (
                <Chip
                  key={chip.value}
                  accessibilityLabel={`${chip.label}, ${chip.count} orders`}
                  accessibilityState={{ selected }}
                  style={[styles.filterChip, selected && styles.filterChipSelected]}
                  onPress={() => setSelectedQueueType(chip.value)}
                >
                  <Text style={textStyle}>
                    {chip.label} <Text style={[textStyle, styles.fontBold]}>({chip.count})</Text>
                  </Text>
                </Chip>
              );
            })}
          </ScrollView>
        )}
        {!isLoadingList && (
          <View style={styles.showAssignedToggle}>
            <ToggleRow
              title="Show Assigned Orders"
              value={!excludeAssignedRequisitions}
              onValueChange={(value) => setExcludeAssignedRequisitions(!value)}
            />
          </View>
        )}
      </View>

      {isLoadingList ? (
        <ListLoadingSkeleton visible count={5} CardComponent={DiscretePickingCardSkeleton} />
      ) : (
        <FlatList
          data={visibleOrders}
          keyExtractor={(order) => order.requisitionId}
          renderItem={({ item }) => (
            <DiscretePickingOrderCard
              order={item}
              showAssignee={!excludeAssignedRequisitions}
              onPress={handleOrderPress}
            />
          )}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <EmptyView
              title="Orders"
              description={emptyStateMessage('orders', searchTerm, 'No open orders ready for picking')}
            />
          }
          refreshControl={<PullToRefreshControl onRefresh={(done) => fetchOrders(excludeAssignedRequisitions, done)} />}
        />
      )}
    </View>
  );
}
