import { ReplenishmentList, ReplenishmentTask, ReplenishmentTaskStatus } from '../../types/replenishment';

export const GET_REPLENISHMENT_LISTS_REQUEST = 'GET_REPLENISHMENT_LISTS_REQUEST';
export const GET_REPLENISHMENT_LISTS_REQUEST_SUCCESS = 'GET_REPLENISHMENT_LISTS_REQUEST_SUCCESS';
export const GET_REPLENISHMENT_LISTS_REQUEST_FAIL = 'GET_REPLENISHMENT_LISTS_REQUEST_FAIL';

export const GET_REPLENISHMENT_TASKS_REQUEST = 'GET_REPLENISHMENT_TASKS_REQUEST';
export const GET_REPLENISHMENT_TASKS_REQUEST_SUCCESS = 'GET_REPLENISHMENT_TASKS_REQUEST_SUCCESS';
export const GET_REPLENISHMENT_TASKS_REQUEST_FAIL = 'GET_REPLENISHMENT_TASKS_REQUEST_FAIL';

export const GET_REPLENISHMENT_TASK_BY_ID_REQUEST = 'GET_REPLENISHMENT_TASK_BY_ID_REQUEST';
export const GET_REPLENISHMENT_TASK_BY_ID_REQUEST_SUCCESS = 'GET_REPLENISHMENT_TASK_BY_ID_REQUEST_SUCCESS';
export const GET_REPLENISHMENT_TASK_BY_ID_REQUEST_FAIL = 'GET_REPLENISHMENT_TASK_BY_ID_REQUEST_FAIL';

export const PICK_REPLENISHMENT_TASK_REQUEST = 'PICK_REPLENISHMENT_TASK_REQUEST';
export const PICK_REPLENISHMENT_TASK_REQUEST_SUCCESS = 'PICK_REPLENISHMENT_TASK_REQUEST_SUCCESS';
export const PICK_REPLENISHMENT_TASK_REQUEST_FAIL = 'PICK_REPLENISHMENT_TASK_REQUEST_FAIL';

export const SHORT_PICK_REPLENISHMENT_TASK_REQUEST = 'SHORT_PICK_REPLENISHMENT_TASK_REQUEST';
export const SHORT_PICK_REPLENISHMENT_TASK_REQUEST_SUCCESS = 'SHORT_PICK_REPLENISHMENT_TASK_REQUEST_SUCCESS';
export const SHORT_PICK_REPLENISHMENT_TASK_REQUEST_FAIL = 'SHORT_PICK_REPLENISHMENT_TASK_REQUEST_FAIL';

export const DROP_REPLENISHMENT_CONTAINER_REQUEST = 'DROP_REPLENISHMENT_CONTAINER_REQUEST';
export const DROP_REPLENISHMENT_CONTAINER_REQUEST_SUCCESS = 'DROP_REPLENISHMENT_CONTAINER_REQUEST_SUCCESS';
export const DROP_REPLENISHMENT_CONTAINER_REQUEST_FAIL = 'DROP_REPLENISHMENT_CONTAINER_REQUEST_FAIL';

export type ReplenishmentCallback<T> = (response: {
  response?: {
    data: T;
    errorCode?: string;
    message?: string;
  };
  errorMessage?: string;
}) => void;

/**
 * @param silent skip the full-screen loader, e.g. for pull-to-refresh which shows its own spinner
 */
export function getReplenishmentListsAction(callback: ReplenishmentCallback<ReplenishmentList[]>, silent = false) {
  return {
    type: GET_REPLENISHMENT_LISTS_REQUEST,
    payload: { silent },
    callback
  };
}

/**
 * @param statuses the statuses of the tasks to get, the open ones (to pick) by default
 */
export function getReplenishmentTasksAction(
  orderId: string,
  callback: ReplenishmentCallback<ReplenishmentTask[]>,
  statuses?: ReplenishmentTaskStatus[]
) {
  return {
    type: GET_REPLENISHMENT_TASKS_REQUEST,
    payload: { orderId, statuses },
    callback
  };
}

export function getReplenishmentTaskByIdAction(taskId: string, callback: ReplenishmentCallback<ReplenishmentTask>) {
  return {
    type: GET_REPLENISHMENT_TASK_BY_ID_REQUEST,
    payload: { taskId },
    callback
  };
}

/** Picks the full remaining quantity of the task into the outbound container */
export function pickReplenishmentTaskAction(
  taskId: string,
  outboundContainerId: string,
  callback: ReplenishmentCallback<ReplenishmentTask>
) {
  return {
    type: PICK_REPLENISHMENT_TASK_REQUEST,
    payload: { taskId, outboundContainerId },
    callback
  };
}

/** Picks less than the remaining quantity (0 without a container) for the given reason */
export function shortPickReplenishmentTaskAction(
  taskId: string,
  outboundContainerId: string | null,
  quantityPicked: number,
  reasonCodeName: string | undefined,
  callback: ReplenishmentCallback<ReplenishmentTask>
) {
  return {
    type: SHORT_PICK_REPLENISHMENT_TASK_REQUEST,
    payload: { taskId, outboundContainerId, quantityPicked, reasonCodeName },
    callback
  };
}

/** Stages the picks of the container in the staging location */
export function dropReplenishmentContainerAction(
  outboundContainerId: string,
  stagingLocationId: string,
  callback: ReplenishmentCallback<ReplenishmentTask[]>
) {
  return {
    type: DROP_REPLENISHMENT_CONTAINER_REQUEST,
    payload: { outboundContainerId, stagingLocationId },
    callback
  };
}
