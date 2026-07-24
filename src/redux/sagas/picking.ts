import { call, put, select, takeLatest } from 'redux-saga/effects';

import * as api from '../../apis';
import { hideScreenLoading, showScreenLoading } from '../actions/main';
import {
  DROP_PICK_TASK_REQUEST,
  DROP_PICK_TASK_REQUEST_FAIL,
  DROP_PICK_TASK_REQUEST_SUCCESS,
  GET_STOCK_MOVEMENT_ITEM_DETAILS_REQUEST,
  GET_STOCK_MOVEMENT_ITEM_DETAILS_REQUEST_FAIL,
  GET_STOCK_MOVEMENT_ITEM_DETAILS_REQUEST_SUCCESS,
  GET_PICK_TASK_BY_ID_REQUEST,
  GET_PICK_TASK_BY_ID_REQUEST_FAIL,
  GET_PICK_TASK_BY_ID_REQUEST_SUCCESS,
  GET_PICK_TASKS_BY_REQUISITION_REQUEST,
  GET_PICK_TASKS_BY_REQUISITION_REQUEST_SUCCESS,
  GET_PICK_TASKS_BY_REQUISITION_REQUEST_FAIL,
  GET_OPEN_PICK_TASKS_REQUEST,
  GET_OPEN_PICK_TASKS_REQUEST_FAIL,
  GET_OPEN_PICK_TASKS_REQUEST_SUCCESS,
  GET_PICK_TASK_COUNTS_REQUEST,
  GET_PICK_TASK_COUNTS_REQUEST_FAIL,
  GET_PICK_TASK_COUNTS_REQUEST_SUCCESS,
  GET_PICK_TASKS_REQUEST,
  GET_PICK_TASKS_REQUEST_FAIL,
  GET_PICK_TASKS_REQUEST_SUCCESS,
  GET_PICKED_TASKS_BY_CONTAINER_REQUEST,
  GET_PICKED_TASKS_BY_CONTAINER_REQUEST_FAIL,
  GET_PICKED_TASKS_BY_CONTAINER_REQUEST_SUCCESS,
  PICK_PICK_TASK_REQUEST,
  PICK_PICK_TASK_REQUEST_FAIL,
  PICK_PICK_TASK_REQUEST_SUCCESS,
  SHORT_PICK_TASK_REQUEST,
  SHORT_PICK_TASK_REQUEST_FAIL,
  SHORT_PICK_TASK_REQUEST_SUCCESS,
  REALLOCATE_PICK_TASK_REQUEST,
  REALLOCATE_PICK_TASK_REQUEST_FAIL,
  REALLOCATE_PICK_TASK_REQUEST_SUCCESS,
  START_PICK_TASK_REQUEST,
  START_PICK_TASK_REQUEST_FAIL,
  START_PICK_TASK_REQUEST_SUCCESS
} from '../actions/picking';
import { userLocation, userSession } from '../selectors/auth';

function* getPickTasksAction(action: any) {
  try {
    // @ts-ignore
    const currentLocation = yield select(userLocation);
    if (!currentLocation) {
      throw new Error('User Location Not Found');
    }
    yield put(showScreenLoading('Fetching Tasks...'));
    // Call API to get pick tasks
    // @ts-ignore
    const response = yield call(api.getPickTasksApi, currentLocation.id, action.payload);
    yield action.callback({ response });
    yield put({ type: GET_PICK_TASKS_REQUEST_SUCCESS, payload: response.data });
    yield put(hideScreenLoading());
  } catch (error) {
    const errorMessage = (error as any)?.message || 'Error Fetching Tasks';
    yield put({ type: GET_PICK_TASKS_REQUEST_FAIL, payload: errorMessage });
    yield action.callback({ errorMessage });
    yield put(hideScreenLoading());
  }
}

function* getOpenPickTasksAction(action: any) {
  try {
    // @ts-ignore
    const currentLocation = yield select(userLocation);
    if (!currentLocation) {
      throw new Error('User Location Not Found');
    }
    yield put(showScreenLoading('Fetching Orders...'));
    // Call API to get all open pick tasks across every queue type
    // @ts-ignore
    const response = yield call(api.getOpenPickTasksApi, currentLocation.id);
    yield action.callback({ response });
    yield put({ type: GET_OPEN_PICK_TASKS_REQUEST_SUCCESS, payload: response.data });
    yield put(hideScreenLoading());
  } catch (error) {
    const errorMessage = (error as any)?.message || 'Error Fetching Orders';
    yield put({ type: GET_OPEN_PICK_TASKS_REQUEST_FAIL, payload: errorMessage });
    yield action.callback({ errorMessage });
    yield put(hideScreenLoading());
  }
}

function* getPickTaskCountsAction(action: any) {
  try {
    // @ts-ignore
    const currentLocation = yield select(userLocation);
    if (!currentLocation) {
      throw new Error('User Location Not Found');
    }
    // @ts-ignore
    const response = yield call(api.getPickTaskCountsApi, currentLocation.id);
    yield action.callback({ response });
    yield put({ type: GET_PICK_TASK_COUNTS_REQUEST_SUCCESS, payload: response.data });
  } catch (error) {
    const errorMessage = (error as any)?.message || 'Error Fetching Pick Task Counts';
    yield put({ type: GET_PICK_TASK_COUNTS_REQUEST_FAIL, payload: errorMessage });
    yield action.callback({ errorMessage });
  }
}

function* startPickTaskAction(action: any) {
  try {
    // @ts-ignore
    const currentLocation = yield select(userLocation);
    if (!currentLocation) {
      throw new Error('User Location Not Found');
    }
    // @ts-ignore
    const session = yield select(userSession);
    if (!session || !session.user) {
      throw new Error('User Session Not Found');
    }
    yield put(showScreenLoading('Starting Pick Task...'));
    // Start Pick Task API Call
    // @ts-ignore
    const response = yield call(api.patchPickTaskApi, currentLocation.id, action.payload.taskId, {
      action: 'start',
      assigneeId: session.user.id
    });
    yield action.callback({ response });
    yield put({ type: START_PICK_TASK_REQUEST_SUCCESS });
    yield put(hideScreenLoading());
  } catch (error) {
    // @ts-ignore
    const errorMessage = (error as any)?.message || 'Error Starting Pick Task';
    yield action.callback({ errorMessage });
    yield put({
      type: START_PICK_TASK_REQUEST_FAIL,
      payload: errorMessage
    });
    yield put(hideScreenLoading());
  }
}

function* pickPickTaskAction(action: any) {
  try {
    // @ts-ignore
    const currentLocation = yield select(userLocation);
    if (!currentLocation) {
      throw new Error('User Location Not Found');
    }
    // @ts-ignore
    const session = yield select(userSession);
    if (!session || !session.user) {
      throw new Error('User Session Not Found');
    }
    yield put(showScreenLoading('Picking Task...'));
    // Pick Pick Task API Call
    // @ts-ignore
    const response = yield call(api.patchPickTaskApi, currentLocation.id, action.payload.taskId, {
      action: 'pick',
      outboundContainerId: action.payload.outboundContainerId,
      pickedById: session.user.id
    });
    yield action.callback(response);
    yield put({ type: PICK_PICK_TASK_REQUEST_SUCCESS });
    yield put(hideScreenLoading());
  } catch (error) {
    // @eslint-disable-next-line
    const errorMessage = (error as any)?.message || 'Error Picking Task';
    yield action.callback({ errorMessage });
    yield put({
      type: PICK_PICK_TASK_REQUEST_FAIL,
      payload: errorMessage
    });
    yield put(hideScreenLoading());
  }
}

function* shortPickTaskAction(action: any) {
  try {
    // @ts-ignore
    const currentLocation = yield select(userLocation);
    if (!currentLocation) {
      throw new Error('User Location Not Found');
    }
    // @ts-ignore
    const session = yield select(userSession);
    if (!session || !session.user) {
      throw new Error('User Session Not Found');
    }
    yield put(showScreenLoading('Shorting Pick Task...'));
    const { taskId, outboundContainerId, quantityPicked, reasonCode } = action.payload;
    // Short Pick Task API Call
    yield call(api.patchPickTaskApi, currentLocation.id, taskId, {
      action: 'short-pick',
      outboundContainerId,
      quantityPicked,
      pickedById: session.user.id,
      reasonCode
    });
    yield put({ type: SHORT_PICK_TASK_REQUEST_SUCCESS });
    yield action.callback({});
    yield put(hideScreenLoading());
  } catch (error) {
    yield put({
      type: SHORT_PICK_TASK_REQUEST_FAIL,
      payload: (error as any)?.message || 'Error Shorting Pick Task'
    });
    yield action.callback({ errorMessage: (error as any)?.message || 'Error Shorting Pick Task' });
    yield put(hideScreenLoading());
  }
}

function* dropPickTaskAction(action: any) {
  try {
    // @ts-ignore
    const currentLocation = yield select(userLocation);
    if (!currentLocation) {
      throw new Error('User Location Not Found');
    }
    // @ts-ignore
    const session = yield select(userSession);
    if (!session || !session.user) {
      throw new Error('User Session Not Found');
    }
    yield put(showScreenLoading('Dropping Pick Task...'));
    // Drop Pick Task API Call
    yield call(api.dropPickTaskApi, currentLocation.id, action.payload.outboundContainerId, {
      action: 'drop',
      stagingLocationId: action.payload.stagingLocationId,
      stagedById: session.user.id
    });
    yield put({ type: DROP_PICK_TASK_REQUEST_SUCCESS });
    yield action.callback({});
    yield put(hideScreenLoading());
  } catch (error) {
    yield put({
      type: DROP_PICK_TASK_REQUEST_FAIL,
      payload: (error as any)?.message || 'Error Dropping Pick Task'
    });
    yield action.callback({ errorMessage: (error as any)?.message || 'Error Dropping Pick Task' });
    yield put(hideScreenLoading());
  }
}

function* getPickTaskByIdAction(action: any) {
  try {
    // @ts-ignore
    const currentLocation = yield select(userLocation);
    if (!currentLocation) {
      throw new Error('User Location Not Found');
    }
    yield put(showScreenLoading('Fetching Pick Task...'));
    // Call API to get pick task by ID
    // @ts-ignore
    const response = yield call(api.getPickTaskByIdApi, currentLocation.id, action.payload.taskId);
    yield put({ type: GET_PICK_TASK_BY_ID_REQUEST_SUCCESS, payload: response.data });
    yield put(hideScreenLoading());
    yield action.callback({ response });
  } catch (error) {
    const errorMessage = (error as any)?.message || 'Error Fetching Pick Task';
    yield put({
      type: GET_PICK_TASK_BY_ID_REQUEST_FAIL,
      payload: errorMessage
    });
    yield action.callback({ errorMessage });
    yield put(hideScreenLoading());
  }
}

function* getPickedTasksByContainerAction(action: any) {
  try {
    // @ts-ignore
    const currentLocation = yield select(userLocation);
    if (!currentLocation) {
      throw new Error('User Location Not Found');
    }
    yield put(showScreenLoading('Fetching Picked Tasks...'));
    // Call API to get picked tasks by container
    // @ts-ignore
    const response = yield call(
      api.getPickTasksByStatusAndContainerApi,
      currentLocation.id,
      action.payload.outboundContainerId,
      'PICKED'
    );
    yield put({ type: GET_PICKED_TASKS_BY_CONTAINER_REQUEST_SUCCESS, payload: response.data });
    yield action.callback({ response });
    yield put(hideScreenLoading());
  } catch (error) {
    yield put({
      type: GET_PICKED_TASKS_BY_CONTAINER_REQUEST_FAIL,
      payload: (error as any)?.message || 'Error Fetching Picked Tasks'
    });
    yield action.callback({ errorMessage: (error as any)?.message || 'Error Fetching Picked Tasks' });
    yield put(hideScreenLoading());
  }
}

function* getPickTasksByRequisitionAction(action: any) {
  try {
    // @ts-ignore
    const currentLocation = yield select(userLocation);
    if (!currentLocation) {
      throw new Error('User Location Not Found');
    }
    yield put(showScreenLoading('Fetching Tasks...'));
    // Call API to get pick tasks by requisition ID
    // @ts-ignore
    const response = yield call(api.getPickTasksByRequisitionApi, currentLocation.id, action.payload.requisitionId, [
      'PENDING',
      'PICKING'
    ]);
    yield action.callback({ response });
    yield put({ type: GET_PICK_TASKS_BY_REQUISITION_REQUEST_SUCCESS, payload: response.data });
    yield put(hideScreenLoading());
  } catch (error) {
    yield put({
      type: GET_PICK_TASKS_BY_REQUISITION_REQUEST_FAIL,
      payload: (error as any)?.message || 'Error Fetching Tasks By Requisition'
    });
    yield action.callback({ errorMessage: (error as any)?.message || 'Error Fetching Tasks By Requisition' });
    yield put(hideScreenLoading());
  }
}

function* getStockMovementItemDetailsAction(action: any) {
  try {
    yield put(showScreenLoading('Fetching Available Items...'));
    // @ts-ignore
    const response = yield call(api.getStockMovementItemDetailsApi, action.payload.requisitionItemId);
    yield put({ type: GET_STOCK_MOVEMENT_ITEM_DETAILS_REQUEST_SUCCESS, payload: response.data });
    yield action.callback({ response });
    yield put(hideScreenLoading());
  } catch (error) {
    const errorMessage = (error as any)?.message || 'Error Fetching Available Items';
    yield put({
      type: GET_STOCK_MOVEMENT_ITEM_DETAILS_REQUEST_FAIL,
      payload: errorMessage
    });
    yield action.callback({ errorMessage });
    yield put(hideScreenLoading());
  }
}

function* reallocatePickTaskAction(action: any) {
  try {
    // @ts-ignore
    const currentLocation = yield select(userLocation);
    if (!currentLocation) {
      throw new Error('User Location Not Found');
    }
    yield put(showScreenLoading('Reallocating...'));
    // @ts-ignore
    const response = yield call(
      api.reallocatePickTaskApi,
      currentLocation.id,
      action.payload.taskId,
      action.payload.picklistItems
    );
    yield put({ type: REALLOCATE_PICK_TASK_REQUEST_SUCCESS, payload: response.data });
    yield action.callback({ response });
    yield put(hideScreenLoading());
  } catch (error) {
    const errorMessage = (error as any)?.message || 'Error Reallocating Pick Task';
    yield put({
      type: REALLOCATE_PICK_TASK_REQUEST_FAIL,
      payload: errorMessage
    });
    yield action.callback({ errorMessage });
    yield put(hideScreenLoading());
  }
}

export default function* watcher() {
  yield takeLatest(GET_PICK_TASKS_REQUEST, getPickTasksAction);
  yield takeLatest(GET_OPEN_PICK_TASKS_REQUEST, getOpenPickTasksAction);
  yield takeLatest(GET_PICK_TASK_COUNTS_REQUEST, getPickTaskCountsAction);
  yield takeLatest(START_PICK_TASK_REQUEST, startPickTaskAction);
  yield takeLatest(PICK_PICK_TASK_REQUEST, pickPickTaskAction);
  yield takeLatest(DROP_PICK_TASK_REQUEST, dropPickTaskAction);
  yield takeLatest(GET_PICK_TASK_BY_ID_REQUEST, getPickTaskByIdAction);
  yield takeLatest(GET_PICKED_TASKS_BY_CONTAINER_REQUEST, getPickedTasksByContainerAction);
  yield takeLatest(SHORT_PICK_TASK_REQUEST, shortPickTaskAction);
  yield takeLatest(GET_PICK_TASKS_BY_REQUISITION_REQUEST, getPickTasksByRequisitionAction);
  yield takeLatest(GET_STOCK_MOVEMENT_ITEM_DETAILS_REQUEST, getStockMovementItemDetailsAction);
  yield takeLatest(REALLOCATE_PICK_TASK_REQUEST, reallocatePickTaskAction);
}
