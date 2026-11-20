import { RouteProp, useFocusEffect, useRoute } from '@react-navigation/native';
import * as React from 'react';
import { Alert, FlatList, Text, TouchableOpacity, View } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Button } from 'react-native-paper';
import { useDispatch } from 'react-redux';

import { PICK_TASK_PAGE_SIZE, StagingWorkScope } from '../../apis/picking';
import BarcodeSearchHeader from '../../components/BarcodeSearchHeader/BarcodeSearchHeader';
import DiscretePickingCardSkeleton from '../Picking/DiscretePickingCardSkeleton';
import EmptyView from '../../components/EmptyView';
import ListLoadingSkeleton from '../../components/ListLoadingSkeleton';
import { navigate, resetToRoutes } from '../../NavigationService';
import { getStagingWorkAction } from '../../redux/actions/picking';
import { PickTask, StagingContainerGroup, StagingOrderGroup, StagingOrderRollup } from '../../types/picking';
import {
  countLabel,
  deliveryTypeLabelOf,
  filterContainerGroups,
  filterOrderRollups,
  groupByContainer,
  groupByOrder,
  linesPickedLabel,
  NO_CONTAINER_KEY
} from './moveToStagingLib';
import Theme from '../../utils/Theme';
import styles from './moveToStagingStyles';
import { ListRow, PanelCard, ProgressRow, StatusPill } from './ui';

type GroupingMode = 'CONTAINER' | 'ORDER';

function summaryLine(grouping: GroupingMode, containers: StagingContainerGroup[], orders: StagingOrderRollup[]) {
  if (grouping === 'CONTAINER') {
    const items = containers.reduce((total, group) => total + group.itemCount, 0);
    return `${countLabel(containers.length, 'container')} · ${countLabel(items, 'item')}`;
  }
  const items = orders.reduce((total, rollup) => total + rollup.pickedLineCount, 0);
  return `${countLabel(orders.length, 'order')} · ${countLabel(items, 'item')}`;
}

// Counts of zero would claim there is no work when the list simply failed to load
function summaryOrPlaceholder(summary: string, loadError: string | undefined, hasData: boolean) {
  return loadError && !hasData ? '—' : summary;
}

function filterLabelOf(containerFilter: string | undefined, pickSession: PickSession | undefined) {
  if (containerFilter) {
    const label =
      containerFilter === pickSession?.containerFilter
        ? pickSession.containerFilterLabel ?? containerFilter
        : containerFilter;
    return `Filtered to container ${label}`;
  }
  if (pickSession?.containerIds?.length) {
    return `Showing the ${countLabel(pickSession.containerIds.length, 'container')} from this pick`;
  }
  return undefined;
}

function StagingEmptyState({ isNarrowed, onBackToDashboard }: { isNarrowed: boolean; onBackToDashboard: () => void }) {
  return (
    <View>
      <EmptyView
        title={isNarrowed ? 'Nothing here matches' : 'Nothing waiting to be staged'}
        description={
          isNarrowed
            ? 'No picked stock matches this filter. Clear it to see everything waiting to be staged at this facility.'
            : 'All picked stock has been moved to a staging location.'
        }
      />
      <Button mode="text" onPress={onBackToDashboard}>
        Back to Dashboard
      </Button>
    </View>
  );
}

// Shown instead of the empty state when nothing came back, so a failed load never reads as "no work"
function StagingLoadError({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <View>
      <EmptyView title="Couldn't load staging work" description={message} />
      <Button mode="contained" style={styles.retryButton} onPress={onRetry}>
        Try again
      </Button>
    </View>
  );
}

function ListFallback({
  loadError,
  isNarrowed,
  onRetry,
  onBackToDashboard
}: {
  loadError?: string;
  isNarrowed: boolean;
  onRetry: () => void;
  onBackToDashboard: () => void;
}) {
  if (loadError) {
    return <StagingLoadError message={loadError} onRetry={onRetry} />;
  }
  return <StagingEmptyState isNarrowed={isNarrowed} onBackToDashboard={onBackToDashboard} />;
}

// A failed refresh keeps the list that was already loaded, and says so
function RefreshErrorBanner({ visible, onRetry }: { visible: boolean; onRetry: () => void }) {
  if (!visible) {
    return null;
  }
  return (
    <View style={[styles.activeFilterRow, styles.bannerBox]}>
      <Text style={[styles.bannerText, styles.bannerTextFill]}>Couldn't refresh. Showing the last loaded list.</Text>
      <TouchableOpacity onPress={onRetry}>
        <Text style={styles.activeFilterClear}>Try again</Text>
      </TouchableOpacity>
    </View>
  );
}

/** Set when the list is opened from Pick Complete, so the picker starts on the work they just picked */
export type PickSession = {
  containerFilter?: string;
  /** Human-readable name of that container; the filter value itself can be a synthetic key */
  containerFilterLabel?: string;
  /** Containers filled by the picking session, so a multi-container walk stays on that session's work */
  containerIds?: string[];
};

type MoveToStagingListRouteProp = RouteProp<
  { MoveToStagingList: { pickSession?: PickSession } | undefined },
  'MoveToStagingList'
>;

export default function MoveToStagingListScreen() {
  const dispatch = useDispatch();
  const { params } = useRoute<MoveToStagingListRouteProp>();
  // Held in state rather than read from params, so clearing it ends the post-pick view for good
  const [pickSession, setPickSession] = React.useState<PickSession | undefined>(params?.pickSession);

  const [tasks, setTasks] = React.useState<PickTask[]>([]);
  const [searchTerm, setSearchTerm] = React.useState<string>('');
  const [containerFilter, setContainerFilter] = React.useState<string | undefined>(
    params?.pickSession?.containerFilter
  );
  const [grouping, setGrouping] = React.useState<GroupingMode>('CONTAINER');
  const [totalCount, setTotalCount] = React.useState<number>(0);
  const [isRefreshing, setIsRefreshing] = React.useState<boolean>(false);
  const [isPullRefreshing, setIsPullRefreshing] = React.useState<boolean>(false);
  const [hasLoaded, setHasLoaded] = React.useState<boolean>(false);
  const [loadError, setLoadError] = React.useState<string | undefined>(undefined);

  const isInSession = React.useCallback(
    (task: PickTask) =>
      !pickSession?.containerIds?.length || pickSession.containerIds.includes(task.outboundContainer?.id ?? ''),
    [pickSession]
  );

  const walkFinishedRef = React.useRef(false);
  const finishPickingWalk = React.useCallback(() => {
    if (walkFinishedRef.current) {
      return;
    }
    walkFinishedRef.current = true;
    Alert.alert('Staging Complete', 'Everything from this pick has been moved to staging.', [
      {
        text: 'OK',
        onPress: () => resetToRoutes([{ name: 'Drawer', params: { screen: 'Dashboard' } }])
      }
    ]);
  }, []);

  // A multi-container pick is filtered on the server too, so its containers are never past the first page
  const workScope = React.useMemo<StagingWorkScope>(
    () => ({
      outboundContainerId: containerFilter,
      outboundContainerIds: containerFilter ? undefined : pickSession?.containerIds
    }),
    [containerFilter, pickSession]
  );

  const fetchWork = React.useCallback(
    (fromPull = false) => {
      setIsRefreshing(true);
      if (fromPull) {
        setIsPullRefreshing(true);
      }
      dispatch(
        getStagingWorkAction({ ...workScope, max: PICK_TASK_PAGE_SIZE, offset: 0 }, ({ response, errorMessage }) => {
          if (errorMessage || !response?.data) {
            setLoadError(errorMessage ?? 'Something went wrong');
          } else {
            setLoadError(undefined);
            const total = response.totalCount ?? response.data.length;
            setTasks(response.data);
            setTotalCount(total);
            // A walk started from picking ends once its own work is gone, not when the facility is empty,
            // and only on a complete list - a partial page cannot prove the work is gone.
            if (pickSession && response.data.length >= total && response.data.filter(isInSession).length === 0) {
              finishPickingWalk();
            }
          }
          setIsRefreshing(false);
          setIsPullRefreshing(false);
          setHasLoaded(true);
        })
      );
    },
    [dispatch, workScope, pickSession, isInSession, finishPickingWalk]
  );

  // The facility-wide picked list can exceed one page, and grouping happens over whatever is
  // loaded, so a truncated list would silently hide containers.
  const isFetchingMoreRef = React.useRef(false);

  // FlatList can fire onEndReached more than once before setIsRefreshing(true) commits, so the
  // dispatch guard has to be a ref checked and set synchronously, not the isRefreshing state.
  const loadMore = React.useCallback(() => {
    if (isFetchingMoreRef.current || tasks.length >= totalCount) {
      return;
    }
    isFetchingMoreRef.current = true;
    setIsRefreshing(true);
    dispatch(
      getStagingWorkAction(
        { ...workScope, max: PICK_TASK_PAGE_SIZE, offset: tasks.length },
        ({ response, errorMessage }) => {
          if (!errorMessage && response?.data) {
            setTasks((previous) => [...previous, ...response.data]);
            setTotalCount(response.totalCount ?? tasks.length + response.data.length);
          }
          isFetchingMoreRef.current = false;
          setIsRefreshing(false);
        }
      )
    );
  }, [dispatch, tasks.length, totalCount, workScope]);

  // Refetch on every entry. A held list is a snapshot that goes stale, and this screen is the
  // way back into interrupted work.
  useFocusEffect(
    React.useCallback(() => {
      fetchWork();
    }, [fetchWork])
  );

  const sessionTasks = React.useMemo(() => tasks.filter(isInSession), [tasks, isInSession]);
  const containerGroups = React.useMemo(() => groupByContainer(sessionTasks), [sessionTasks]);
  const orderRollups = React.useMemo(() => groupByOrder(sessionTasks), [sessionTasks]);

  const visibleContainers = React.useMemo(
    () => filterContainerGroups(containerGroups, searchTerm),
    [containerGroups, searchTerm]
  );
  const visibleOrders = React.useMemo(() => filterOrderRollups(orderRollups, searchTerm), [orderRollups, searchTerm]);

  const openOrder = (group: StagingOrderGroup) => {
    navigate('MoveToStagingOrder', {
      requisitionId: group.requisitionId,
      requisitionNumber: group.requisitionNumber,
      outboundContainerId: group.containerId ?? undefined,
      withoutContainer: group.containerId === null,
      containerLabel: group.containerLabel
    });
  };

  const stageWholeContainer = (group: StagingContainerGroup) => {
    navigate('StagingLocation', {
      scope: 'container',
      outboundContainerId: group.containerId ?? undefined,
      containerLabel: group.containerLabel
    });
  };

  // Leaves the post-pick view and opens up the whole facility. Scans only search the loaded list,
  // which matches containers and order numbers alike.
  const clearFilter = () => {
    setPickSession(undefined);
    setContainerFilter(undefined);
  };

  const containerIcon = (group: { isEmployeeLocation: boolean; containerId: string | null }) =>
    group.isEmployeeLocation ? 'account-outline' : group.containerId ? 'cart-outline' : 'package-variant-closed';

  const linesPill = (picked: number, total: number) => (
    <StatusPill label={linesPickedLabel(picked, total)} tone={picked < total ? 'warning' : 'neutral'} />
  );

  const renderOrderRow = (group: StagingOrderGroup) => (
    <ListRow
      chevron
      key={group.key}
      title={group.requisitionNumber ?? 'Order'}
      subtitle={[group.destination, deliveryTypeLabelOf(group.deliveryTypeCode)].filter(Boolean).join(' · ')}
      pills={
        <>
          {linesPill(group.pickedCumulativeCount, group.orderTotalLineCount)}
          <StatusPill label={`${group.pickedLineCount} to stage`} tone="info" />
          {group.hasStockIssue ? <StatusPill label="Stock missing" tone="warning" icon="alert" /> : null}
        </>
      }
      onPress={() => openOrder(group)}
    />
  );

  const renderContainer = ({ item }: { item: StagingContainerGroup }) => (
    <PanelCard
      title={item.containerLabel || 'No container'}
      icon={containerIcon(item)}
      right={<StatusPill label={`${countLabel(item.itemCount, 'item')} to stage`} tone="info" />}
      subtitle={item.isEmployeeLocation ? 'Picked without scanning a cart. Held for this picker only.' : undefined}
    >
      {item.orders.map(renderOrderRow)}
      {item.containerId ? (
        <TouchableOpacity style={styles.cardActionRow} onPress={() => stageWholeContainer(item)}>
          <Text style={styles.sectionAction}>
            {item.orders.length === 1
              ? 'Send this container to one location'
              : `Send all ${countLabel(item.orders.length, 'order')} to one location`}
          </Text>
        </TouchableOpacity>
      ) : null}
    </PanelCard>
  );

  const renderOrderRollup = ({ item }: { item: StagingOrderRollup }) => {
    const onlyGroup = item.groups.length === 1 ? item.groups[0] : undefined;

    const card = (
      <View style={styles.orderCard}>
        <View style={styles.orderCardTitleRow}>
          <Text style={styles.orderCardTitle}>{item.requisitionNumber ?? 'Order'}</Text>
          {onlyGroup ? (
            <MaterialCommunityIcons name="chevron-right" size={26} color={Theme.colors.secondaryForeground} />
          ) : null}
        </View>
        <Text style={styles.orderCardSubtitle} numberOfLines={2}>
          {[item.destination, deliveryTypeLabelOf(item.deliveryTypeCode)].filter(Boolean).join(' · ')}
        </Text>

        <ProgressRow done={item.pickedCumulativeCount} total={item.orderTotalLineCount} />

        {item.isSplitAcrossContainers ? (
          <View style={styles.bannerBox}>
            <Text style={styles.bannerText}>
              Picked into {countLabel(item.groups.length, 'place')}. Staging this order takes{' '}
              {countLabel(item.groups.length, 'trip')} — tap a container below to start one.
            </Text>
          </View>
        ) : null}

        <View style={styles.pillRow}>
          {item.groups.map((group) =>
            onlyGroup ? (
              <StatusPill key={group.key} label={group.containerLabel || 'No container'} icon={containerIcon(group)} />
            ) : (
              // Split across carts: the chip is the only way to choose which trip to stage.
              <TouchableOpacity key={group.key} accessibilityRole="button" onPress={() => openOrder(group)}>
                <StatusPill
                  label={`${group.containerLabel || 'No container'} · ${group.pickedLineCount}`}
                  icon={containerIcon(group)}
                />
              </TouchableOpacity>
            )
          )}
          {item.openLineCount > 0 ? (
            <StatusPill label={`${countLabel(item.openLineCount, 'line')} still to pick`} tone="warning" />
          ) : null}
          {item.stagedCount > 0 ? (
            <StatusPill label={`${item.stagedCount} staged`} tone="success" icon="check-circle-outline" />
          ) : null}
        </View>
      </View>
    );

    if (!onlyGroup) {
      return card;
    }

    return (
      <TouchableOpacity accessibilityRole="button" onPress={() => openOrder(onlyGroup)}>
        {card}
      </TouchableOpacity>
    );
  };

  const backToDashboard = () => {
    resetToRoutes([{ name: 'Drawer', params: { screen: 'Dashboard' } }]);
  };

  const retry = () => fetchWork();
  const emptyState = (
    <ListFallback
      loadError={loadError}
      isNarrowed={Boolean(containerFilter || searchTerm.trim())}
      onRetry={retry}
      onBackToDashboard={backToDashboard}
    />
  );
  const hasData = tasks.length > 0;

  const isLoadingList = !hasLoaded;
  const summary = summaryLine(grouping, visibleContainers, visibleOrders);
  const filterLabel = filterLabelOf(containerFilter, pickSession);

  return (
    <View style={styles.screenContainer}>
      <BarcodeSearchHeader
        searchBox
        autoSearch
        placeholder="Scan container or order to filter"
        resetSearch={() => setSearchTerm('')}
        accessibilityLabel="Scan container or order to filter"
        loading={hasLoaded && isRefreshing && !isPullRefreshing}
        onSearchTermSubmit={setSearchTerm}
      />

      <View style={styles.listHeader}>
        <View style={styles.summaryRow}>
          <Text style={styles.sectionLabel}>WAITING TO BE STAGED</Text>
          <Text style={styles.summaryValue}>{summaryOrPlaceholder(summary, loadError, hasData)}</Text>
        </View>

        <RefreshErrorBanner visible={Boolean(loadError) && hasData} onRetry={retry} />

        {filterLabel ? (
          <View style={styles.activeFilterRow}>
            <Text style={styles.activeFilterText}>{filterLabel}</Text>
            <TouchableOpacity accessibilityRole="button" onPress={clearFilter}>
              <Text style={styles.activeFilterClear}>Clear</Text>
            </TouchableOpacity>
          </View>
        ) : null}

        <View style={styles.toggleTrack}>
          <TouchableOpacity
            style={[styles.toggleButton, grouping === 'CONTAINER' && styles.toggleButtonSelected]}
            onPress={() => setGrouping('CONTAINER')}
          >
            <Text style={[styles.toggleText, grouping === 'CONTAINER' && styles.toggleTextSelected]}>By Container</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.toggleButton, grouping === 'ORDER' && styles.toggleButtonSelected]}
            onPress={() => setGrouping('ORDER')}
          >
            <Text style={[styles.toggleText, grouping === 'ORDER' && styles.toggleTextSelected]}>By Order</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.listArea}>
        {isLoadingList ? (
          <ListLoadingSkeleton visible count={4} CardComponent={DiscretePickingCardSkeleton} />
        ) : grouping === 'CONTAINER' ? (
          <FlatList
            data={visibleContainers}
            keyExtractor={(group) => group.containerId ?? NO_CONTAINER_KEY}
            renderItem={renderContainer}
            contentContainerStyle={styles.listContent}
            refreshing={isPullRefreshing}
            ListEmptyComponent={emptyState}
            onRefresh={() => fetchWork(true)}
            onEndReached={loadMore}
            onEndReachedThreshold={0.5}
          />
        ) : (
          <FlatList
            data={visibleOrders}
            keyExtractor={(rollup) => rollup.requisitionId}
            renderItem={renderOrderRollup}
            contentContainerStyle={styles.listContent}
            refreshing={isPullRefreshing}
            ListEmptyComponent={emptyState}
            onRefresh={() => fetchWork(true)}
            onEndReached={loadMore}
            onEndReachedThreshold={0.5}
          />
        )}
      </View>
    </View>
  );
}
