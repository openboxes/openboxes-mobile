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
  const query: string[] = [];

  if (params?.deliveryTypeCode) {
    query.push(`deliveryTypeCode=${encodeURIComponent(params.deliveryTypeCode)}`);
  }

  if (params?.ordersCount !== undefined && params?.ordersCount !== null) {
    query.push(`ordersCount=${encodeURIComponent(params.ordersCount)}`);
  }

  const queryString = query.length > 0 ? `?${query.join('&')}` : '';

  return ApiClient.get(`/facilities/${facilityId}/pick-tasks${queryString}`);
}

// Fetch all open pick tasks (across every queue type) for the discrete picking order list.
export function getOpenPickTasksApi(facilityId: string) {
  const statuses = ['PENDING', 'PICKING'];

  return ApiClient.get(
    `/facilities/${facilityId}/pick-tasks?${statuses.map((status) => `status=${encodeURIComponent(status)}`).join('&')}`
  );
}

export function getPickTaskCountsApi(facilityId: string) {
  return ApiClient.get(`/facilities/${facilityId}/pick-tasks/counts`);
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
