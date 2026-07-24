import { PickTaskParams } from '../../apis';
import { DeliveryTypeOrderCount, PickPageItem, PickTask, ReallocatePicklistItem } from '../../types/picking';

export const GET_PICK_TASKS_REQUEST = 'GET_PICK_TASKS_REQUEST';
export const GET_PICK_TASKS_REQUEST_SUCCESS = 'GET_PICK_TASKS_REQUEST_SUCCESS';
export const GET_PICK_TASKS_REQUEST_FAIL = 'GET_PICK_TASKS_REQUEST_FAIL';

export const GET_OPEN_PICK_TASKS_REQUEST = 'GET_OPEN_PICK_TASKS_REQUEST';
export const GET_OPEN_PICK_TASKS_REQUEST_SUCCESS = 'GET_OPEN_PICK_TASKS_REQUEST_SUCCESS';
export const GET_OPEN_PICK_TASKS_REQUEST_FAIL = 'GET_OPEN_PICK_TASKS_REQUEST_FAIL';

export const GET_PICK_TASK_COUNTS_REQUEST = 'GET_PICK_TASK_COUNTS_REQUEST';
export const GET_PICK_TASK_COUNTS_REQUEST_SUCCESS = 'GET_PICK_TASK_COUNTS_REQUEST_SUCCESS';
export const GET_PICK_TASK_COUNTS_REQUEST_FAIL = 'GET_PICK_TASK_COUNTS_REQUEST_FAIL';

export const START_PICK_TASK_REQUEST = 'START_PICK_TASK_REQUEST';
export const START_PICK_TASK_REQUEST_SUCCESS = 'START_PICK_TASK_REQUEST_SUCCESS';
export const START_PICK_TASK_REQUEST_FAIL = 'START_PICK_TASK_REQUEST_FAIL';

export const PICK_PICK_TASK_REQUEST = 'PICK_PICK_TASK_REQUEST';
export const PICK_PICK_TASK_REQUEST_SUCCESS = 'PICK_PICK_TASK_REQUEST_SUCCESS';
export const PICK_PICK_TASK_REQUEST_FAIL = 'PICK_PICK_TASK_REQUEST_FAIL';

export const DROP_PICK_TASK_REQUEST = 'DROP_PICK_TASK_REQUEST';
export const DROP_PICK_TASK_REQUEST_SUCCESS = 'DROP_PICK_TASK_REQUEST_SUCCESS';
export const DROP_PICK_TASK_REQUEST_FAIL = 'DROP_PICK_TASK_REQUEST_FAIL';

export const GET_PICK_TASK_BY_ID_REQUEST = 'GET_PICK_TASK_BY_ID_REQUEST';
export const GET_PICK_TASK_BY_ID_REQUEST_SUCCESS = 'GET_PICK_TASK_BY_ID_REQUEST_SUCCESS';
export const GET_PICK_TASK_BY_ID_REQUEST_FAIL = 'GET_PICK_TASK_BY_ID_REQUEST_FAIL';

export const GET_PICKED_TASKS_BY_CONTAINER_REQUEST = 'GET_PICKED_TASKS_BY_CONTAINER_REQUEST';
export const GET_PICKED_TASKS_BY_CONTAINER_REQUEST_SUCCESS = 'GET_PICKED_TASKS_BY_CONTAINER_REQUEST_SUCCESS';
export const GET_PICKED_TASKS_BY_CONTAINER_REQUEST_FAIL = 'GET_PICKED_TASKS_BY_CONTAINER_REQUEST_FAIL';

export const SHORT_PICK_TASK_REQUEST = 'SHORT_PICK_TASK_REQUEST';
export const SHORT_PICK_TASK_REQUEST_SUCCESS = 'SHORT_PICK_TASK_REQUEST_SUCCESS';
export const SHORT_PICK_TASK_REQUEST_FAIL = 'SHORT_PICK_TASK_REQUEST_FAIL';

export const GET_PICK_TASKS_BY_REQUISITION_REQUEST = 'GET_PICK_TASKS_BY_REQUISITION_REQUEST';
export const GET_PICK_TASKS_BY_REQUISITION_REQUEST_SUCCESS = 'GET_PICK_TASKS_BY_REQUISITION_REQUEST_SUCCESS';
export const GET_PICK_TASKS_BY_REQUISITION_REQUEST_FAIL = 'GET_PICK_TASKS_BY_REQUISITION_REQUEST_FAIL';

export const GET_STOCK_MOVEMENT_ITEM_DETAILS_REQUEST = 'GET_STOCK_MOVEMENT_ITEM_DETAILS_REQUEST';
export const GET_STOCK_MOVEMENT_ITEM_DETAILS_REQUEST_SUCCESS = 'GET_STOCK_MOVEMENT_ITEM_DETAILS_REQUEST_SUCCESS';
export const GET_STOCK_MOVEMENT_ITEM_DETAILS_REQUEST_FAIL = 'GET_STOCK_MOVEMENT_ITEM_DETAILS_REQUEST_FAIL';

export const REALLOCATE_PICK_TASK_REQUEST = 'REALLOCATE_PICK_TASK_REQUEST';
export const REALLOCATE_PICK_TASK_REQUEST_SUCCESS = 'REALLOCATE_PICK_TASK_REQUEST_SUCCESS';
export const REALLOCATE_PICK_TASK_REQUEST_FAIL = 'REALLOCATE_PICK_TASK_REQUEST_FAIL';

export function getPickTasksAction(
  params: PickTaskParams,
  callback: (response: {
    response?: {
      data: PickTask[];
      errorCode?: string;
      message?: string;
      max?: number;
      offset?: number;
      totalCount?: number;
    };
    errorMessage?: string;
  }) => void
) {
  return {
    type: GET_PICK_TASKS_REQUEST,
    payload: { ...params },
    callback
  };
}

export function getOpenPickTasksAction(
  callback: (response: {
    response?: {
      data: PickTask[];
      errorCode?: string;
      message?: string;
      max?: number;
      offset?: number;
      totalCount?: number;
    };
    errorMessage?: string;
  }) => void
) {
  return {
    type: GET_OPEN_PICK_TASKS_REQUEST,
    callback
  };
}

export function getPickTaskCountsAction(
  callback: (response: { response?: { data: DeliveryTypeOrderCount[] }; errorMessage?: string }) => void
) {
  return {
    type: GET_PICK_TASK_COUNTS_REQUEST,
    callback
  };
}

export function getPickTasksByRequisitionAction(
  requisitionId: string,
  callback: (response: {
    response?: {
      data: PickTask[];
      errorCode?: string;
      message?: string;
      max?: number;
      offset?: number;
      totalCount?: number;
    };
    errorMessage?: string;
  }) => void
) {
  return {
    type: GET_PICK_TASKS_BY_REQUISITION_REQUEST,
    payload: { requisitionId },
    callback
  };
}

export function startPickTaskAction(taskId: string, callback: (response: { errorMessage?: string }) => void) {
  return {
    type: START_PICK_TASK_REQUEST,
    payload: { taskId },
    callback
  };
}

export function pickPickTaskAction(
  taskId: string,
  outboundContainerId: string,
  callback: (response: { errorMessage?: string }) => void
) {
  return {
    type: PICK_PICK_TASK_REQUEST,
    payload: { taskId, outboundContainerId },
    callback
  };
}

export function shortPickTaskAction(
  taskId: string,
  outboundContainerId: string | null,
  quantityPicked: number,
  callback: (response: { errorMessage?: string }) => void,
  reasonCode?: string
) {
  return {
    type: SHORT_PICK_TASK_REQUEST,
    payload: { taskId, quantityPicked, reasonCode, outboundContainerId },
    callback
  };
}

export function dropPickTaskAction(
  outboundContainerId: string,
  stagingLocationId: string,
  callback?: (response: { errorMessage?: string }) => void
) {
  return {
    type: DROP_PICK_TASK_REQUEST,
    payload: { outboundContainerId, stagingLocationId },
    callback
  };
}

export function getPickTaskByIdAction(
  taskId: string,
  callback: (response: {
    response?: {
      data: PickTask;
      errorCode?: string;
      message?: string;
    };
    errorMessage?: string;
  }) => void
) {
  return {
    type: GET_PICK_TASK_BY_ID_REQUEST,
    payload: { taskId },
    callback
  };
}

export function getPickedTasksByContainerAction(
  outboundContainerId: string,
  callback: (response: {
    response: {
      data: PickTask[];
      errorCode?: string;
      message?: string;
      max?: number;
      offset?: number;
      totalCount?: number;
    };
  }) => void
) {
  return {
    type: GET_PICKED_TASKS_BY_CONTAINER_REQUEST,
    payload: { outboundContainerId },
    callback
  };
}

export function getStockMovementItemDetailsAction(
  requisitionItemId: string,
  callback: (response: {
    response?: {
      data: PickPageItem;
      errorCode?: string;
      message?: string;
    };
    errorMessage?: string;
  }) => void
) {
  return {
    type: GET_STOCK_MOVEMENT_ITEM_DETAILS_REQUEST,
    payload: { requisitionItemId },
    callback
  };
}

export function reallocatePickTaskAction(
  taskId: string,
  picklistItems: ReallocatePicklistItem[],
  callback: (response: {
    response?: {
      data: PickTask[];
      errorCode?: string;
      message?: string;
    };
    errorMessage?: string;
  }) => void
) {
  return {
    type: REALLOCATE_PICK_TASK_REQUEST,
    payload: { taskId, picklistItems },
    callback
  };
}
