import {
  DeliveryTypeCode,
  DiscretePickingOrder,
  OrderPickStatusCode,
  PickTask,
  PickTaskStatus
} from '../../types/picking';
import { DELIVERY_TYPES } from './constants';

export const ALL_QUEUE_TYPES = 'ALL' as const;
export type QueueTypeFilter = DeliveryTypeCode | typeof ALL_QUEUE_TYPES;

// Lookup from delivery type code to its (client-side) queue priority. Lower = higher priority.
const DELIVERY_TYPE_PRIORITY: Record<string, number> = DELIVERY_TYPES.reduce<Record<string, number>>((acc, type) => {
  acc[type.code] = type.priority;
  return acc;
}, {});

const LOWEST_PRIORITY = Number.MAX_SAFE_INTEGER;

function deliveryTypePriority(code?: DeliveryTypeCode): number {
  return code && DELIVERY_TYPE_PRIORITY[code] !== undefined ? DELIVERY_TYPE_PRIORITY[code] : LOWEST_PRIORITY;
}

/**
 * Group a flat list of open pick tasks into orders. Tasks that share a requisition
 * belong to the same order; order-level fields are taken from the first task seen.
 */
export function groupTasksIntoOrders(tasks: PickTask[]): DiscretePickingOrder[] {
  const ordersById = new Map<string, DiscretePickingOrder>();
  const searchTokensById = new Map<string, Set<string>>();
  const returnedTaskCountById = new Map<string, number>();

  const collectSearchTokens = (requisitionId: string, task: PickTask) => {
    const tokens = searchTokensById.get(requisitionId);
    [task.product?.name, task.product?.productCode].forEach((token) => {
      if (token) {
        tokens?.add(token);
      }
    });
  };

  tasks.forEach((task) => {
    const requisitionId = task.requisitionId;
    if (!requisitionId) {
      return;
    }

    if (!ordersById.has(requisitionId)) {
      ordersById.set(requisitionId, {
        requisitionId,
        requisitionNumber: task.requisitionNumber,
        destination: task.destination,
        destinationLocationType: task.destinationLocationType,
        deliveryTypeCode: task.deliveryTypeCode,
        assignee: task.assignee,
        priority: task.priority,
        // Prefer the order wide counts, since this response only carries the open lines.
        taskCount: task.orderTotalTaskCount ?? 0,
        openTaskCount: task.orderOpenTaskCount ?? 0,
        inProgress: false,
        searchIndex: ''
      });
      searchTokensById.set(requisitionId, new Set<string>());
      returnedTaskCountById.set(requisitionId, 0);
    }

    const order = ordersById.get(requisitionId) as DiscretePickingOrder;
    returnedTaskCountById.set(requisitionId, (returnedTaskCountById.get(requisitionId) ?? 0) + 1);
    // Tasks are only assigned once picking starts, so take the first assignee found.
    if (!order.assignee && task.assignee) {
      order.assignee = task.assignee;
    }
    if (task.status === PickTaskStatus.PICKING || task.orderPickStatusCode === OrderPickStatusCode.PARTIALLY_PICKED) {
      order.inProgress = true;
    }
    collectSearchTokens(requisitionId, task);
  });

  return Array.from(ordersById.values()).map((order) => {
    const returnedTaskCount = returnedTaskCountById.get(order.requisitionId) ?? 0;
    order.taskCount = order.taskCount || returnedTaskCount;
    order.openTaskCount = order.openTaskCount || returnedTaskCount;

    const searchTokens = Array.from(searchTokensById.get(order.requisitionId) ?? []);
    order.searchIndex = [order.requisitionNumber, order.destination, ...searchTokens]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();
    return order;
  });
}

/**
 * Sort orders by requisition priority (ascending, lower = higher priority), then by
 * queue-type priority. Orders without a priority sort to the bottom.
 */
export function sortOrders(orders: DiscretePickingOrder[]): DiscretePickingOrder[] {
  return [...orders].sort((a, b) => {
    const priorityA = a.priority ?? LOWEST_PRIORITY;
    const priorityB = b.priority ?? LOWEST_PRIORITY;
    if (priorityA !== priorityB) {
      return priorityA - priorityB;
    }
    return deliveryTypePriority(a.deliveryTypeCode) - deliveryTypePriority(b.deliveryTypeCode);
  });
}

/** Real-time client-side filter across the search term and the selected queue-type chip. */
export function filterOrders(
  orders: DiscretePickingOrder[],
  { search, queueType }: { search?: string; queueType: QueueTypeFilter }
): DiscretePickingOrder[] {
  const term = search?.trim().toLowerCase();

  return orders.filter((order) => {
    const matchesQueue = queueType === ALL_QUEUE_TYPES || order.deliveryTypeCode === queueType;
    const matchesSearch = !term || order.searchIndex.includes(term);
    return matchesQueue && matchesSearch;
  });
}

/** Count of orders per queue type, used for the chip badges. */
export function queueChipCounts(orders: DiscretePickingOrder[]): Record<string, number> {
  return orders.reduce<Record<string, number>>((acc, order) => {
    if (order.deliveryTypeCode) {
      acc[order.deliveryTypeCode] = (acc[order.deliveryTypeCode] ?? 0) + 1;
    }
    return acc;
  }, {});
}
