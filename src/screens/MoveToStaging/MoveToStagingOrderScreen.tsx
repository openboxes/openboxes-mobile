import { RouteProp, useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import * as React from 'react';
import { Alert, FlatList, Text, View } from 'react-native';
import { Checkbox } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useDispatch } from 'react-redux';

import { goBack, navigate } from '../../NavigationService';
import { getOrderStagingDetailAction } from '../../redux/actions/picking';
import { PickTask, PickTaskStatus } from '../../types/picking';
import Theme from '../../utils/Theme';
import { countLabel, deliveryTypeLabelOf, stagingLocationLabel } from './moveToStagingLib';
import styles from './moveToStagingStyles';
import { ActionButton, ListRow, SectionLabel, StatusPill } from './ui';

type MoveToStagingOrderRouteProp = RouteProp<
  {
    MoveToStagingOrder: {
      requisitionId: string;
      requisitionNumber?: string;
      outboundContainerId?: string;
      /** The group came from the "No container" card, which the backend cannot express as a filter */
      withoutContainer?: boolean;
      containerLabel?: string;
    };
  },
  'MoveToStagingOrder'
>;

function containerIconFor(outboundContainerId?: string, isEmployeeLocation?: boolean): string {
  if (!outboundContainerId) {
    return 'package-variant-closed';
  }
  return isEmployeeLocation ? 'account-outline' : 'cart-outline';
}

function selectionLabel(selected: number, selectable: number): string {
  return selected > 0 ? `${selected} of ${selectable} selected` : 'Picked items';
}

function buildSelectionActions(
  selectableIds: string[],
  selectedIds: string[],
  setSelectedIds: (ids: string[]) => void
): { label: string; onPress: () => void }[] {
  if (selectableIds.length === 0) {
    return [];
  }

  const actions = [];
  if (selectedIds.length < selectableIds.length) {
    actions.push({ label: 'Select all', onPress: () => setSelectedIds(selectableIds) });
  }
  if (selectedIds.length > 0) {
    actions.push({ label: 'Clear', onPress: () => setSelectedIds([]) });
  }
  return actions;
}

/** Scoped to this order AND this cart: other orders can still have stock sitting in the same cart. */
function StagedConfirmation({ containerLabel, pickedElsewhere }: { containerLabel: string; pickedElsewhere: number }) {
  return (
    <>
      <View style={styles.completeNotice}>
        <MaterialCommunityIcons name="check-circle-outline" size={20} color={Theme.colors.successForeground} />
        <Text style={styles.completeNoticeText}>Everything this order had in {containerLabel} is staged.</Text>
      </View>
      {pickedElsewhere > 0 ? (
        <Text style={styles.completeNoticeNote}>
          {countLabel(pickedElsewhere, 'more line')} of this order {pickedElsewhere === 1 ? 'is' : 'are'} waiting in
          another container, so it stays on the list.
        </Text>
      ) : null}
    </>
  );
}

// Once a selection exists the primary action becomes staging it, so the whole order is never staged by
// reflex; after a partial stage "all" would misread as the whole order, hence "remaining".
function StageActions({
  pickedCount,
  stagedCount,
  selectedCount,
  onStageAll,
  onStageSelected
}: {
  pickedCount: number;
  stagedCount: number;
  selectedCount: number;
  onStageAll: () => void;
  onStageSelected: () => void;
}) {
  const stageAllLabel =
    stagedCount > 0
      ? `Stage remaining ${countLabel(pickedCount, 'item')}`
      : `Stage all ${countLabel(pickedCount, 'picked item')}`;
  const hasSelection = selectedCount > 0;

  return (
    <>
      <ActionButton
        label={hasSelection ? `Stage ${countLabel(selectedCount, 'selected item')}` : stageAllLabel}
        disabled={pickedCount === 0}
        onPress={hasSelection ? onStageSelected : onStageAll}
      />
      <ActionButton
        label={hasSelection ? stageAllLabel : 'Stage selected'}
        variant="ghost"
        style={styles.buttonSpacing}
        disabled={!hasSelection}
        onPress={onStageAll}
      />
    </>
  );
}

export default function MoveToStagingOrderScreen() {
  const { params } = useRoute<MoveToStagingOrderRouteProp>();
  const { requisitionId, requisitionNumber, outboundContainerId, withoutContainer, containerLabel } = params;
  const dispatch = useDispatch();

  const [tasks, setTasks] = React.useState<PickTask[]>([]);
  const [selectedIds, setSelectedIds] = React.useState<string[]>([]);

  // Fetched for the whole order, not just this cart. The screen still shows one cart, but it can only
  // tell the picker why the order stays on the list if it can see the cart it is not showing.
  const fetchOrder = React.useCallback(() => {
    dispatch(
      getOrderStagingDetailAction(requisitionId, undefined, ({ response, errorMessage }) => {
        // Without the order there is nothing to stage, and an empty screen would read as a finished order
        if (errorMessage || !response?.data) {
          Alert.alert('Could Not Load Order', errorMessage ?? 'The order could not be loaded.', [
            { text: 'OK', onPress: goBack }
          ]);
          return;
        }
        setTasks(response.data);
        setSelectedIds([]);
      })
    );
  }, [dispatch, requisitionId]);

  useFocusEffect(
    React.useCallback(() => {
      fetchOrder();
    }, [fetchOrder])
  );

  const isInScope = React.useCallback(
    (task: PickTask) => {
      const container = task.outboundContainer;
      if (withoutContainer) {
        return !container?.id;
      }
      if (!outboundContainerId) {
        return true;
      }
      return container?.id === outboundContainerId || container?.locationNumber === outboundContainerId;
    },
    [withoutContainer, outboundContainerId]
  );

  const scopedTasks = React.useMemo(() => tasks.filter(isInScope), [tasks, isInScope]);

  const pickedTasks = React.useMemo(
    () => scopedTasks.filter((task) => task.status === PickTaskStatus.PICKED),
    [scopedTasks]
  );
  const stagedTasks = React.useMemo(
    () => scopedTasks.filter((task) => task.status === PickTaskStatus.STAGED),
    [scopedTasks]
  );
  const openTasks = React.useMemo(
    () =>
      scopedTasks.filter((task) => task.status === PickTaskStatus.PENDING || task.status === PickTaskStatus.PICKING),
    [scopedTasks]
  );

  const firstTask = scopedTasks[0];
  const orderNumber = requisitionNumber ?? firstTask?.requisitionNumber;
  const sourceLabel = containerLabel ?? 'No container';

  const navigation = useNavigation();
  React.useLayoutEffect(() => {
    if (orderNumber) {
      navigation.setOptions({ title: orderNumber });
    }
  }, [navigation, orderNumber]);

  const selectionActions = buildSelectionActions(
    pickedTasks.map((task) => task.id),
    selectedIds,
    setSelectedIds
  );

  const toggleSelected = (taskId: string) => {
    setSelectedIds((previous) =>
      previous.includes(taskId) ? previous.filter((id) => id !== taskId) : [...previous, taskId]
    );
  };

  const stageAll = () => {
    navigate('StagingLocation', {
      scope: 'order',
      requisitionId,
      requisitionNumber: orderNumber,
      outboundContainerId,
      containerLabel: sourceLabel,
      // Without a container the order scope alone would reach every other cart of this order.
      pickTaskIds: withoutContainer ? pickedTasks.map((task) => task.id) : undefined,
      itemCount: pickedTasks.length
    });
  };

  const stageSelected = () => {
    navigate('StagingLocation', {
      scope: 'items',
      requisitionId,
      requisitionNumber: orderNumber,
      outboundContainerId,
      containerLabel: sourceLabel,
      pickTaskIds: selectedIds,
      itemCount: selectedIds.length,
      pickedCount: pickedTasks.length
    });
  };

  const renderTask = ({ item }: { item: PickTask }) => {
    const isStaged = item.status === PickTaskStatus.STAGED;
    const isSelected = selectedIds.includes(item.id);

    return (
      <ListRow
        title={item.product.name}
        subtitle={`${item.product.productCode} · Qty ${item.quantityPicked}`}
        muted={isStaged}
        selected={isSelected}
        disabled={isStaged}
        leading={
          isStaged ? (
            <MaterialCommunityIcons
              name="check"
              size={24}
              color={Theme.colors.successForeground}
              style={styles.rowLeading}
            />
          ) : (
            <View style={styles.rowLeading}>
              <Checkbox
                status={isSelected ? 'checked' : 'unchecked'}
                color={Theme.colors.primary}
                onPress={() => toggleSelected(item.id)}
              />
            </View>
          )
        }
        pills={
          isStaged && item.dateStaged && item.stagingLocation ? (
            <StatusPill label={stagingLocationLabel(item.stagingLocation)} tone="outline" icon="map-marker-outline" />
          ) : null
        }
        onPress={() => toggleSelected(item.id)}
      />
    );
  };

  // One base for the pills: the lines of this order sitting in this container. Order-wide facts stay in
  // the sentence, so a pill and a sentence can never look like two readings of the same number.
  const containerLineCount = pickedTasks.length + stagedTasks.length;
  // Nothing left to stage here. Without this the screen ends on two buttons that can never be
  // pressed, and the only way on is the back arrow.
  const isFullyStaged = pickedTasks.length === 0 && stagedTasks.length > 0;
  // Order-wide, not container-scoped: the detail fetch filters by container, and unpicked lines have none.
  const openLineCount = firstTask?.orderOpenTaskCount ?? openTasks.length;
  // Counted, not derived from the order-wide totals: those cannot tell a line picked into another cart
  // from one already staged there, and only the first keeps this order on the outstanding list.
  const pickedElsewhere = tasks.filter((task) => task.status === PickTaskStatus.PICKED && !isInScope(task)).length;
  const rows = [...pickedTasks, ...stagedTasks];

  return (
    <View style={styles.screenContainer}>
      <View style={styles.headerBlock}>
        <Text style={styles.headerTitle}>{firstTask?.destination ?? orderNumber}</Text>
        <Text style={styles.headerSubtitle}>
          Showing the {countLabel(containerLineCount, 'line')} picked into {sourceLabel}.
          {openLineCount > 0 ? ` ${countLabel(openLineCount, 'line')} on this order still unpicked.` : ''}
        </Text>
        <View style={styles.pillRow}>
          <StatusPill label={sourceLabel} icon={containerIconFor(outboundContainerId, firstTask?.employeeLocation)} />
          {deliveryTypeLabelOf(firstTask?.deliveryTypeCode) ? (
            <StatusPill label={deliveryTypeLabelOf(firstTask?.deliveryTypeCode) as string} />
          ) : null}
          {pickedTasks.length > 0 ? <StatusPill label={`${pickedTasks.length} to stage`} tone="info" /> : null}
        </View>
      </View>

      <SectionLabel highlighted={selectedIds.length > 0} actions={selectionActions}>
        {isFullyStaged ? 'Staged items' : selectionLabel(selectedIds.length, pickedTasks.length)}
      </SectionLabel>

      <FlatList
        data={rows}
        keyExtractor={(task) => task.id}
        renderItem={renderTask}
        style={styles.listSurface}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={() => <View style={styles.hairline} />}
      />

      <View style={styles.actionBar}>
        {isFullyStaged ? (
          <>
            <StagedConfirmation containerLabel={sourceLabel} pickedElsewhere={pickedElsewhere} />
            <ActionButton label="Back to Move to Staging" onPress={goBack} />
          </>
        ) : (
          <StageActions
            pickedCount={pickedTasks.length}
            stagedCount={stagedTasks.length}
            selectedCount={selectedIds.length}
            onStageAll={stageAll}
            onStageSelected={stageSelected}
          />
        )}
      </View>
    </View>
  );
}
