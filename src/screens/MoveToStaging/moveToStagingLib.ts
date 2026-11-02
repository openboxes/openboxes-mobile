import Location from '../../data/location/Location';
import {
  DeliveryTypeCode,
  PickTask,
  StagingContainerGroup,
  StagingOrderGroup,
  StagingOrderRollup
} from '../../types/picking';
import { DELIVERY_TYPES } from '../Picking/constants';

export const NO_CONTAINER_KEY = 'NO_CONTAINER';

const DELIVERY_TYPE_LABELS: Record<string, string> = DELIVERY_TYPES.reduce<Record<string, string>>((acc, type) => {
  acc[type.code] = type.label;
  return acc;
}, {});

export function deliveryTypeLabelOf(code?: DeliveryTypeCode): string | undefined {
  return code ? DELIVERY_TYPE_LABELS[code] ?? code : undefined;
}

/**
 * The list only ever loads PICKED tasks, so a staged line is absent from the payload. Progress has to be
 * derived from the order-wide counts instead, or "picked" understates itself by however much is staged.
 */
function derivePickedCounts(total: number, open: number, waiting: number) {
  const pickedCumulativeCount = Math.max(total - open, waiting);
  return { pickedCumulativeCount, stagedCount: Math.max(pickedCumulativeCount - waiting, 0) };
}

export function countLabel(count: number, singular: string): string {
  return `${count} ${count === 1 ? singular : `${singular}s`}`;
}

export function linesPickedLabel(picked: number, total: number): string {
  return `${picked} of ${total} lines picked`;
}

function containerKeyOf(task: PickTask): string {
  return task.outboundContainer?.id ?? NO_CONTAINER_KEY;
}

// The bin number is what is printed on the label, so it is shown next to the descriptive name.
export function stagingLocationLabel(location: Location): string {
  if (!location.locationNumber || location.locationNumber === location.name) {
    return location.name;
  }
  return `${location.name} (${location.locationNumber})`;
}

export function containerLabelOf(task: PickTask): string {
  const container = task.outboundContainer;
  if (!container) {
    return 'No container';
  }
  // An employee location's number is an opaque key (EMP-<facility>-<employee>); its name is the
  // person, which is what the picker recognises. A cart is the other way round.
  if (task.employeeLocation) {
    return container.name || container.locationNumber;
  }
  return container.locationNumber || container.name;
}

function buildSearchIndex(parts: (string | undefined | null)[]): string {
  return parts.filter(Boolean).join(' ').toLowerCase();
}

/**
 * Split picked tasks into (order, container) pairs. This pair is the drop scope the backend
 * accepts, so it is also the unit the list shows — an order picked into two carts appears twice.
 */
export function groupIntoOrderGroups(tasks: PickTask[]): StagingOrderGroup[] {
  const groups = new Map<string, StagingOrderGroup>();
  const productTokens = new Map<string, Set<string>>();
  // Order-wide, not per (order, container) group — a group's own pickedLineCount only
  // covers the lines picked into that one container, so it is the wrong fallback when
  // the backend omits orderTotalTaskCount and the order spans multiple carts.
  const taskCountByRequisitionId = new Map<string, number>();

  tasks.forEach((task) => {
    if (!task.requisitionId) {
      return;
    }

    const containerKey = containerKeyOf(task);
    const key = `${task.requisitionId}::${containerKey}`;

    if (!groups.has(key)) {
      groups.set(key, {
        key,
        requisitionId: task.requisitionId,
        requisitionNumber: task.requisitionNumber,
        destination: task.destination,
        destinationLocationType: task.destinationLocationType,
        deliveryTypeCode: task.deliveryTypeCode,
        openLineCount: task.orderOpenTaskCount ?? 0,
        containerId: task.outboundContainer?.id ?? null,
        containerLabel: containerLabelOf(task),
        isEmployeeLocation: Boolean(task.employeeLocation),
        tasks: [],
        pickedLineCount: 0,
        pickedCumulativeCount: 0,
        orderTotalLineCount: task.orderTotalTaskCount ?? 0,
        hasStockIssue: false,
        searchIndex: ''
      });
      productTokens.set(key, new Set<string>());
    }

    const group = groups.get(key) as StagingOrderGroup;
    group.tasks.push(task);
    group.pickedLineCount += 1;
    if (task.hasStockIssue) {
      group.hasStockIssue = true;
    }
    taskCountByRequisitionId.set(task.requisitionId, (taskCountByRequisitionId.get(task.requisitionId) ?? 0) + 1);

    const tokens = productTokens.get(key);
    [task.product?.name, task.product?.productCode].forEach((token) => {
      if (token) {
        tokens?.add(token);
      }
    });
  });

  return Array.from(groups.values()).map((group) => {
    const requisitionTaskCount = taskCountByRequisitionId.get(group.requisitionId) ?? 0;
    group.orderTotalLineCount = group.orderTotalLineCount || requisitionTaskCount;
    // Waiting has to be counted order-wide, not per container: with an order split across two carts,
    // the lines waiting in the other cart would otherwise be mistaken for picked-and-staged.
    group.pickedCumulativeCount = derivePickedCounts(
      group.orderTotalLineCount,
      group.openLineCount,
      requisitionTaskCount
    ).pickedCumulativeCount;
    group.searchIndex = buildSearchIndex([
      group.requisitionNumber,
      group.destination,
      group.containerLabel,
      ...Array.from(productTokens.get(group.key) ?? [])
    ]);
    return group;
  });
}

export function groupByContainer(tasks: PickTask[]): StagingContainerGroup[] {
  const orderGroups = groupIntoOrderGroups(tasks);
  const containers = new Map<string, StagingContainerGroup>();

  orderGroups.forEach((group) => {
    const key = group.containerId ?? NO_CONTAINER_KEY;

    if (!containers.has(key)) {
      containers.set(key, {
        containerId: group.containerId,
        containerLabel: group.containerLabel,
        isEmployeeLocation: group.isEmployeeLocation,
        itemCount: 0,
        orders: []
      });
    }

    const container = containers.get(key) as StagingContainerGroup;
    container.orders.push(group);
    container.itemCount += group.pickedLineCount;
  });

  return Array.from(containers.values()).sort((a, b) => a.containerLabel.localeCompare(b.containerLabel));
}

export function groupByOrder(tasks: PickTask[]): StagingOrderRollup[] {
  const orderGroups = groupIntoOrderGroups(tasks);
  const rollups = new Map<string, StagingOrderRollup>();

  orderGroups.forEach((group) => {
    if (!rollups.has(group.requisitionId)) {
      rollups.set(group.requisitionId, {
        requisitionId: group.requisitionId,
        requisitionNumber: group.requisitionNumber,
        destination: group.destination,
        destinationLocationType: group.destinationLocationType,
        deliveryTypeCode: group.deliveryTypeCode,
        groups: [],
        pickedLineCount: 0,
        pickedCumulativeCount: 0,
        stagedCount: 0,
        openLineCount: group.openLineCount,
        orderTotalLineCount: 0,
        isSplitAcrossContainers: false,
        searchIndex: ''
      });
    }

    const rollup = rollups.get(group.requisitionId) as StagingOrderRollup;
    rollup.groups.push(group);
    rollup.pickedLineCount += group.pickedLineCount;
    // Every group of this order already carries the same order-wide fallback, but take
    // the max rather than the first so a genuine disagreement between backend values
    // can never round the total down.
    rollup.orderTotalLineCount = Math.max(rollup.orderTotalLineCount, group.orderTotalLineCount);
    rollup.isSplitAcrossContainers = rollup.groups.length > 1;
  });

  return Array.from(rollups.values()).map((rollup) => {
    Object.assign(rollup, derivePickedCounts(rollup.orderTotalLineCount, rollup.openLineCount, rollup.pickedLineCount));
    rollup.searchIndex = buildSearchIndex([
      rollup.requisitionNumber,
      rollup.destination,
      ...rollup.groups.map((group) => group.containerLabel)
    ]);
    return rollup;
  });
}

export function filterContainerGroups(groups: StagingContainerGroup[], term?: string): StagingContainerGroup[] {
  const needle = term?.trim().toLowerCase();
  if (!needle) {
    return groups;
  }

  return groups
    .map((group) => {
      const orders = group.orders.filter((order) => order.searchIndex.includes(needle));
      return {
        ...group,
        orders,
        itemCount: orders.reduce((total, order) => total + order.pickedLineCount, 0)
      };
    })
    .filter((group) => group.orders.length > 0);
}

export function filterOrderRollups(rollups: StagingOrderRollup[], term?: string): StagingOrderRollup[] {
  const needle = term?.trim().toLowerCase();
  if (!needle) {
    return rollups;
  }

  return rollups
    .map((rollup) => {
      const groups = rollup.groups.filter((group) => group.searchIndex.includes(needle));
      return {
        ...rollup,
        groups,
        pickedLineCount: groups.reduce((total, group) => total + group.pickedLineCount, 0),
        isSplitAcrossContainers: groups.length > 1
      };
    })
    .filter((rollup) => rollup.groups.length > 0);
}
