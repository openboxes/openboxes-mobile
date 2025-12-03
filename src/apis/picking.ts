import { DeliveryTypeCode } from '../types/picking';
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
    };

export type PickTaskDropParams = {
  action: 'drop';
  stagingLocationId: string;
  // User Id
  stagedById: string;
};

export function getPickTasksApi(facilityId: string, params: PickTaskParams) {
  const { deliveryTypeCode, ordersCount } = params;

  return ApiClient.get(
    `/facilities/${facilityId}/pick-tasks?deliveryTypeCode=${encodeURIComponent(
      deliveryTypeCode
    )}&ordersCount=${encodeURIComponent(ordersCount)}`
  );
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
