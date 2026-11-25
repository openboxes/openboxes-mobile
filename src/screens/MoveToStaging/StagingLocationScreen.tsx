import { RouteProp, useRoute } from '@react-navigation/native';
import * as React from 'react';
import { Alert, ScrollView, Text, View } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useDispatch } from 'react-redux';

import { PICK_TASK_PAGE_SIZE } from '../../apis/picking';
import { ScannerInput } from '../../components/ScannerInput';
import StagingLocationZoneMismatchModal from '../../components/StagingLocationZoneMismatchModal';
import { SearchButton } from '../../components/SearchButton';
import { useSearchButton } from '../../components/SearchButton/useSearchButton';
import { EMPTY_STRING } from '../../constants';
import { goBack, navigate } from '../../NavigationService';
import { dropPickTaskAction, getOrderStagingDetailAction, getStagingWorkAction } from '../../redux/actions/picking';
import { PickTask, PickTaskStatus } from '../../types/picking';
import Theme from '../../utils/Theme';
import { countLabel, stagingLocationLabel } from './moveToStagingLib';
import styles from './moveToStagingStyles';
import { LabelValueRow, ListRow, PanelCard, SectionLabel } from './ui';

type StagingLocationRouteProp = RouteProp<
  {
    StagingLocation: {
      scope: 'container' | 'order' | 'items';
      outboundContainerId?: string;
      containerLabel?: string;
      requisitionId?: string;
      requisitionNumber?: string;
      pickTaskIds?: string[];
      itemCount?: number;
      pickedCount?: number;
    };
  },
  'StagingLocation'
>;

type MovingItems = { tasks?: PickTask[]; error?: boolean };

type StagedElsewhere = {
  locationId: string;
  locationName: string;
  itemCount: number;
  stagedBy?: string;
};

export default function StagingLocationScreen() {
  const { params } = useRoute<StagingLocationRouteProp>();
  const {
    scope,
    outboundContainerId,
    containerLabel,
    requisitionId,
    requisitionNumber,
    pickTaskIds,
    itemCount,
    pickedCount
  } = params;
  const dispatch = useDispatch();

  const [stagingLocationNumber, setStagingLocationNumber] = React.useState<string>(EMPTY_STRING);
  const [stagedElsewhere, setStagedElsewhere] = React.useState<StagedElsewhere[]>([]);
  const [pendingLocationId, setPendingLocationId] = React.useState<string>(EMPTY_STRING);
  const [zoneMismatchMessage, setZoneMismatchMessage] = React.useState<string | undefined>(undefined);
  // A ref as well as state: a second scan can arrive before the re-render that disables the scanner
  const dropInFlightRef = React.useRef(false);
  const [isDropping, setIsDropping] = React.useState(false);
  const [moving, setMoving] = React.useState<MovingItems>({});
  const [itemsExpanded, setItemsExpanded] = React.useState(false);
  const { isSearchOpen, searchButtonProps } = useSearchButton({ onSelect: setStagingLocationNumber });

  React.useEffect(() => {
    if (scope !== 'container') {
      return;
    }
    dispatch(
      getStagingWorkAction({ outboundContainerId, max: PICK_TASK_PAGE_SIZE }, ({ response, errorMessage }) => {
        setMoving(errorMessage || !response?.data ? { error: true } : { tasks: response.data });
      })
    );
  }, [dispatch, scope, outboundContainerId]);

  React.useEffect(() => {
    if (!requisitionId) {
      return;
    }
    dispatch(
      getOrderStagingDetailAction(requisitionId, undefined, ({ response, errorMessage }) => {
        if (errorMessage || !response?.data) {
          setMoving({ error: true });
          return;
        }
        setStagedElsewhere(summariseStagedLocations(response.data));
        setMoving({ tasks: response.data.filter((task) => isMoving(task, outboundContainerId, pickTaskIds)) });
      })
    );
  }, [dispatch, requisitionId, outboundContainerId, pickTaskIds]);

  // Back to the order, which is where the confirmation lives. Only a whole-container drop has no order
  // screen worth returning to - that cart is gone from the list entirely.
  const finish = () => {
    if (scope === 'container') {
      navigate('MoveToStagingList');
      return;
    }

    goBack();
  };

  // Always defers to the server: it is the authority on whether the scanned location is valid for
  // this delivery type's zone (per-facility configurable). A mismatch surfaces a modal offering to
  // stage at the scanned location anyway, rather than sending the user back.
  const setDropInFlight = (inFlight: boolean) => {
    dropInFlightRef.current = inFlight;
    setIsDropping(inFlight);
  };

  // Hardware scans bypass the loading overlay and alerts, so one drop at a time is enforced here
  const drop = (locationId: string, overrideStagingLocationZone?: boolean) => {
    if (dropInFlightRef.current) {
      return;
    }
    setDropInFlight(true);
    dispatch(
      dropPickTaskAction(
        {
          outboundContainerId,
          requisitionId: scope === 'container' ? undefined : requisitionId,
          pickTaskIds: pickTaskIds && pickTaskIds.length > 0 ? pickTaskIds : undefined
        },
        locationId,
        ({ errorMessage, allowOverride }) => {
          if (allowOverride) {
            setPendingLocationId(locationId);
            setZoneMismatchMessage(errorMessage);
            setDropInFlight(false);
            return;
          }

          if (errorMessage) {
            // The list is server-derived, so a scope that resolves to nothing usually means
            // someone else staged it first. Send the user back so the list refetches.
            Alert.alert('Staging Failed', errorMessage, [
              {
                text: 'OK',
                onPress: () => {
                  setDropInFlight(false);
                  setStagingLocationNumber(EMPTY_STRING);
                  goBack();
                }
              }
            ]);
            return;
          }

          setDropInFlight(false);
          finish();
        },
        overrideStagingLocationZone
      )
    );
  };

  const handleScan = (locationId: string) => {
    if (!locationId) {
      return;
    }

    drop(locationId);
  };

  const handleStageAnyway = () => {
    setZoneMismatchMessage(undefined);
    drop(pendingLocationId, true);
  };

  const sourceLabel = containerLabel ?? 'No container';
  const orderLabel = requisitionNumber ?? requisitionId ?? 'Order';

  // Scope-driven so a part-picked order is never rendered the same as a whole one. Returns an array
  // rather than a fragment, so PanelCard can see each row and put a hairline between them.
  // The last row expands into the item list once the items are loaded.
  const renderMovingRows = () => {
    const toggle = moving.tasks ? { expanded: itemsExpanded, onToggle: () => setItemsExpanded((open) => !open) } : {};

    if (scope === 'container') {
      return [
        <LabelValueRow key="container" label="Container" value={sourceLabel} />,
        <LabelValueRow key="moving" label="Moving" value={wholeContainerLabel(moving)} {...toggle} />
      ];
    }

    return [
      <LabelValueRow key="container" label="Container" value={sourceLabel} />,
      <LabelValueRow key="order" label="Order" value={orderLabel} />,
      <LabelValueRow
        key="items"
        label="Items"
        value={
          scope === 'order'
            ? itemCount !== undefined
              ? `All ${itemCount} picked`
              : 'All picked'
            : `${itemCount ?? 0} of ${pickedCount ?? itemCount ?? 0} selected`
        }
        {...toggle}
      />
    ];
  };

  return (
    <ScrollView style={styles.screenContainer} keyboardShouldPersistTaps="handled">
      <Text style={styles.screenTitle}>Scan the staging location</Text>
      <Text style={styles.screenSubtitle}>
        Scan the barcode of the bin, rack or floor spot where these items belong.
      </Text>

      <PanelCard title="Moving" titleVariant="label">
        {[...renderMovingRows(), ...renderMovingItems(moving, scope === 'container', itemsExpanded)]}
      </PanelCard>

      <View style={styles.scannerRow}>
        <ScannerInput
          style={styles.scannerInput}
          label="Staging Location"
          value={stagingLocationNumber}
          isEnabled={!isSearchOpen && !zoneMismatchMessage && !isDropping}
          onChange={setStagingLocationNumber}
          onSubmit={handleScan}
        />
        <SearchButton searchType="location" {...searchButtonProps} />
      </View>

      {requisitionId ? (
        <>
          <SectionLabel>Already staged for this order</SectionLabel>

          {stagedElsewhere.length === 0 ? (
            <Text style={styles.sectionEmptyText}>
              Nothing yet — these are the first items of this order to be staged.
            </Text>
          ) : (
            <>
              <PanelCard style={styles.cardTight}>
                {stagedElsewhere.map((entryRow) => (
                  <ListRow
                    key={entryRow.locationId}
                    title={entryRow.locationName}
                    subtitle={`${countLabel(entryRow.itemCount, 'item')}${
                      entryRow.stagedBy ? ` · staged by ${entryRow.stagedBy}` : ''
                    }`}
                    leading={
                      <MaterialCommunityIcons
                        name="map-marker-outline"
                        size={22}
                        color={Theme.colors.primary}
                        style={styles.rowLeading}
                      />
                    }
                    trailingAction="Use"
                    onPress={() => handleScan(entryRow.locationId)}
                  />
                ))}
              </PanelCard>
              <Text style={styles.helperText}>Tap a location to reuse it, or scan a different one.</Text>
            </>
          )}
        </>
      ) : null}

      <StagingLocationZoneMismatchModal
        visible={!!zoneMismatchMessage}
        message={zoneMismatchMessage}
        onScanAnother={() => {
          setZoneMismatchMessage(undefined);
          setStagingLocationNumber(EMPTY_STRING);
        }}
        onStageAnyway={handleStageAnyway}
      />
    </ScrollView>
  );
}

// Mirrors the drop scope, so the list shows exactly what the scan is about to move
function isMoving(task: PickTask, outboundContainerId?: string, pickTaskIds?: string[]) {
  if (task.status !== PickTaskStatus.PICKED) {
    return false;
  }
  if (pickTaskIds && pickTaskIds.length > 0) {
    return pickTaskIds.includes(task.id);
  }
  if (!outboundContainerId) {
    return true;
  }
  return (
    task.outboundContainer?.id === outboundContainerId || task.outboundContainer?.locationNumber === outboundContainerId
  );
}

function wholeContainerLabel(moving: MovingItems) {
  return moving.tasks ? `Whole container · ${countLabel(moving.tasks.length, 'item')}` : 'Whole container';
}

function groupByOrder(tasks: PickTask[]) {
  const groups = new Map<string, PickTask[]>();
  tasks.forEach((task) => {
    const key = task.requisitionId ?? '';
    groups.set(key, [...(groups.get(key) ?? []), task]);
  });
  return Array.from(groups.entries()).map(([key, groupTasks]) => ({ key, tasks: groupTasks }));
}

const MovingOrderHeader: React.FC<{ task: PickTask; count: number }> = ({ task, count }) => (
  <View style={styles.movingOrderHeader}>
    <Text style={styles.movingOrderTitle} numberOfLines={1}>
      {task.requisitionNumber}
      <Text style={styles.movingOrderMeta}>{task.destination ? ` · ${task.destination}` : ''}</Text>
    </Text>
    <Text style={styles.movingOrderMeta}>{countLabel(count, 'item')}</Text>
  </View>
);

const MovingItem: React.FC<{ task: PickTask; indented: boolean }> = ({ task, indented }) => (
  <View style={[styles.movingItem, indented && styles.movingItemIndented]}>
    <Text style={styles.movingItemTitle} numberOfLines={1}>
      {task.product.name}
      <Text style={styles.movingItemCode}>{` (${task.product.productCode})`}</Text>
    </Text>
    <Text style={styles.movingItemQty}>{`Qty ${task.quantityPicked}`}</Text>
  </View>
);

// Grouped by order for a whole container, since a cart often carries several
const MovingItemsBlock: React.FC<{ tasks: PickTask[]; grouped: boolean }> = ({ tasks, grouped }) => (
  <View style={styles.movingItemsBlock}>
    {(grouped ? groupByOrder(tasks) : [{ key: 'all', tasks }]).map((group, index) => (
      <View key={group.key} style={[styles.movingOrderGroup, index > 0 && styles.movingOrderDivider]}>
        {grouped ? <MovingOrderHeader task={group.tasks[0]} count={group.tasks.length} /> : null}
        {group.tasks.map((task) => (
          <MovingItem key={task.id} task={task} indented={grouped} />
        ))}
      </View>
    ))}
  </View>
);

// Collapsed by default so the scan field stays in reach; the items sit on their own tinted block
// so they don't read as more summary rows.
function renderMovingItems(moving: MovingItems, grouped: boolean, expanded: boolean) {
  if (moving.error) {
    return [
      <Text key="items-error" style={styles.movingNote}>
        Couldn't load the items. You can still scan a location.
      </Text>
    ];
  }
  if (!moving.tasks || !expanded) {
    return [];
  }
  return [<MovingItemsBlock key="items" tasks={moving.tasks} grouped={grouped} />];
}

function summariseStagedLocations(tasks: PickTask[]): StagedElsewhere[] {
  const byLocation = new Map<string, StagedElsewhere>();

  tasks
    // A STAGED task with no dateStaged is a cancellation — nothing was moved, so the location the
    // view falls back to is a suggestion, not a place this order actually sits.
    .filter((task) => task.status === PickTaskStatus.STAGED && task.dateStaged && task.stagingLocation?.id)
    .forEach((task) => {
      const location = task.stagingLocation;
      if (!location) {
        return;
      }

      const existing = byLocation.get(location.id);
      if (existing) {
        existing.itemCount += 1;
        return;
      }

      byLocation.set(location.id, {
        locationId: location.id,
        locationName: stagingLocationLabel(location),
        itemCount: 1,
        stagedBy: task.stagedBy ? `${task.stagedBy.firstName ?? ''} ${task.stagedBy.lastName ?? ''}`.trim() : undefined
      });
    });

  return Array.from(byLocation.values());
}
