import { DeliveryTypeCode, ReallocatePicklistItem, ReasonCode } from '../types/picking';
import ApiClient from '../utils/ApiClient';

/** Page size shared by the staging list and the order detail query so both show the same slice. */
export const PICK_TASK_PAGE_SIZE = 250;

export type PickTaskParams = {
  deliveryTypeCode: DeliveryTypeCode;
  ordersCount: number;
};

export type PickTaskActionParams =
  | {
      action: 'start';
      // User Id
      assigneeId: string;
    }
  | {
      action: 'pick';
      outboundContainerId: string | null;
      // User Id
      pickedById: string;
    }
  | {
      action: 'short-pick';
      outboundContainerId: string | null;
      quantityPicked: number;
      pickedById: string;
      reasonCode?: Pick<ReasonCode, 'id'>;
    };

// The three scope fields are independent filters combined with AND; at least one is required.
export type PickTaskDropScope = {
  outboundContainerId?: string;
  requisitionId?: string;
  pickTaskIds?: string[];
};

export type PickTaskDropParams = PickTaskDropScope & {
  action: 'drop';
  stagingLocationId: string;
  // True when the caller is overriding a previously reported staging location zone mismatch
  overrideStagingLocationZone?: boolean;
};

export function getPickTasksApi(facilityId: string, params?: Partial<PickTaskParams>) {
  const query: string[] = ['excludeAssignedRequisitions=true'];

  if (params?.deliveryTypeCode) {
    query.push(`deliveryTypeCode=${encodeURIComponent(params.deliveryTypeCode)}`);
  }

  if (params?.ordersCount !== undefined && params?.ordersCount !== null) {
    query.push(`ordersCount=${encodeURIComponent(params.ordersCount)}`);
  }

  return ApiClient.get(`/facilities/${facilityId}/pick-tasks?${query.join('&')}`);
}

// Fetch all open pick tasks (across every queue type) for the discrete picking order list.
// When excludeAssignedRequisitions is true, the backend skips pick tasks already assigned to other users.
export function getOpenPickTasksApi(facilityId: string, excludeAssignedRequisitions?: boolean) {
  const statuses = ['PENDING', 'PICKING'];
  const query = statuses.map((status) => `status=${encodeURIComponent(status)}`);

  if (excludeAssignedRequisitions !== undefined) {
    query.push(`excludeAssignedRequisitions=${excludeAssignedRequisitions}`);
  }

  return ApiClient.get(`/facilities/${facilityId}/pick-tasks?${query.join('&')}`);
}

export function getPickTaskCountsApi(facilityId: string) {
  return ApiClient.get(`/facilities/${facilityId}/pick-tasks/counts?excludeAssignedRequisitions=true`);
}

export function patchPickTaskApi(facilityId: string, taskId: string, params: PickTaskActionParams) {
  return ApiClient.patch(`/facilities/${facilityId}/pick-tasks/${taskId}`, params);
}

export function dropPickTaskApi(facilityId: string, params: PickTaskDropParams) {
  return ApiClient.patch(`/facilities/${facilityId}/pick-tasks/drop`, params);
}

export function getPickTaskByIdApi(facilityId: string, taskId: string) {
  return ApiClient.get(`/facilities/${facilityId}/pick-tasks/${taskId}`);
}

export function getStagingWorkApi(
  facilityId: string,
  params?: { outboundContainerId?: string; max?: number; offset?: number }
) {
  const query = ['status=PICKED'];

  if (params?.outboundContainerId) {
    query.push(`outboundContainerId=${encodeURIComponent(params.outboundContainerId)}`);
  }
  if (params?.max !== undefined) {
    query.push(`max=${params.max}`);
  }
  if (params?.offset !== undefined) {
    query.push(`offset=${params.offset}`);
  }

  return ApiClient.get(`/facilities/${facilityId}/pick-tasks?${query.join('&')}`);
}

// No status filter on purpose: with a requisitionId the backend returns every status for that
// order, so the picked lines and the already-staged panel arrive in a single request.
export function getOrderStagingDetailApi(facilityId: string, requisitionId: string, outboundContainerId?: string) {
  const query = [`requisitionId=${encodeURIComponent(requisitionId)}`, `max=${PICK_TASK_PAGE_SIZE}`];

  if (outboundContainerId) {
    query.push(`outboundContainerId=${encodeURIComponent(outboundContainerId)}`);
  }

  return ApiClient.get(`/facilities/${facilityId}/pick-tasks?${query.join('&')}`);
}

export function getPickTasksByRequisitionApi(facilityId: string, requisitionId: string, statuses: string[]) {
  return ApiClient.get(
    `/facilities/${facilityId}/pick-tasks?requisitionId=${encodeURIComponent(requisitionId)}&${statuses
      .map((status) => `status=${encodeURIComponent(status)}`)
      .join('&')}`
  );
}

export function getStockMovementItemDetailsApi(requisitionItemId: string) {
  return ApiClient.get(`/stockMovementItems/${requisitionItemId}/details`, {
    params: { stepNumber: 4, refreshPicklistItems: false }
  });
}

export function reallocatePickTaskApi(facilityId: string, taskId: string, picklistItems: ReallocatePicklistItem[]) {
  return ApiClient.post(`/facilities/${facilityId}/pick-tasks/${taskId}/reallocate`, { picklistItems });
}
