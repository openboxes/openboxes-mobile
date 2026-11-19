import { ReplenishmentTaskStatus } from '../types/replenishment';
import apiClient from '../utils/ApiClient';

export const OPEN_TASK_STATUSES = [ReplenishmentTaskStatus.PENDING, ReplenishmentTaskStatus.PICKING];

export const ALL_TASK_STATUSES = Object.values(ReplenishmentTaskStatus);

/** Status of a list whose tasks are all picked, with picks waiting in containers to be staged */
export const LIST_STATUS_PICKED = 'PICKED';

/**
 * The lists still to work on: with tasks to pick (PENDING or PICKING), or with picks to stage (PICKED). A list with
 * neither is staged and ready for putaway, so it is not returned.
 */
export function getReplenishmentListsApi(facilityId: string) {
  return apiClient.get(`/facilities/${facilityId}/replenishments?status=PENDING&status=PICKING&status=PICKED`);
}

export function getReplenishmentTasksApi(
  facilityId: string,
  orderId: string,
  statuses: ReplenishmentTaskStatus[] = OPEN_TASK_STATUSES
) {
  const statusParams = statuses.map((status) => `&status=${status}`).join('');
  return apiClient.get(`/facilities/${facilityId}/replenishment-tasks?orderId=${orderId}${statusParams}`);
}

export function getReplenishmentTaskByIdApi(facilityId: string, taskId: string) {
  return apiClient.get(`/facilities/${facilityId}/replenishment-tasks/${taskId}`);
}

/** Mirrors PickTaskActionParams of the outbound pick-tasks API */
export type ReplenishmentTaskActionParams =
  | {
      action: 'start';
      assigneeId: string;
    }
  | {
      action: 'pick';
      outboundContainerId: string;
      pickedById: string;
    }
  | {
      action: 'short-pick';
      outboundContainerId: string | null;
      quantityPicked: number;
      pickedById: string;
      reasonCode?: { name: string };
    };

export function patchReplenishmentTaskApi(facilityId: string, taskId: string, params: ReplenishmentTaskActionParams) {
  return apiClient.patch(`/facilities/${facilityId}/replenishment-tasks/${taskId}`, params);
}

/** Mirrors PickTaskDropParams of the outbound pick-tasks API */
export type ReplenishmentContainerDropParams = {
  action: 'drop';
  stagingLocationId: string;
  stagedById: string;
};

/** Stages the picks of a container in a staging location; responds with the tasks staged */
export function dropReplenishmentContainerApi(
  facilityId: string,
  outboundContainerId: string,
  params: ReplenishmentContainerDropParams
) {
  return apiClient.patch(`/facilities/${facilityId}/replenishment-tasks/containers/${outboundContainerId}`, params);
}
