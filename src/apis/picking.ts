import { DeliveryTypeCode, ReallocatePicklistItem, ReasonCode } from '../types/picking';
import ApiClient from '../utils/ApiClient';

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
      outboundContainerId: string;
      // User Id
      pickedById: string;
    }
  | {
      action: 'short-pick';
      outboundContainerId: string | null;
      quantityPicked: number;
      pickedById: string;
      reasonCode?: Pick<ReasonCode, 'name'>;
    };

export type PickTaskDropParams = {
  action: 'drop';
  stagingLocationId: string;
  // User Id
  stagedById: string;
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

export function dropPickTaskApi(facilityId: string, outboundContainerId: string, params: PickTaskDropParams) {
  return ApiClient.patch(`/facilities/${facilityId}/pick-tasks/containers/${outboundContainerId}`, params);
}

export function getPickTaskByIdApi(facilityId: string, taskId: string) {
  return ApiClient.get(`/facilities/${facilityId}/pick-tasks/${taskId}`);
}

export function getPickTasksByStatusAndContainerApi(facilityId: string, outboundContainerId: string, status: 'PICKED') {
  return ApiClient.get(
    `/facilities/${facilityId}/pick-tasks?outboundContainerId=${encodeURIComponent(
      outboundContainerId
    )}&status=${encodeURIComponent(status)}`
  );
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
