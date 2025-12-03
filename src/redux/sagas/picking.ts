import { call, put, select, takeLatest } from 'redux-saga/effects';

import * as api from '../../apis';
import { hideScreenLoading, showScreenLoading } from '../actions/main';
import {
  DROP_PICK_TASK_REQUEST,
  DROP_PICK_TASK_REQUEST_FAIL,
  DROP_PICK_TASK_REQUEST_SUCCESS,
  GET_PICK_TASK_BY_ID_REQUEST,
  GET_PICK_TASK_BY_ID_REQUEST_FAIL,
  GET_PICK_TASK_BY_ID_REQUEST_SUCCESS,
  GET_PICK_TASKS_REQUEST,
  GET_PICK_TASKS_REQUEST_FAIL,
  GET_PICK_TASKS_REQUEST_SUCCESS,
  GET_PICKED_TASKS_BY_CONTAINER_REQUEST,
  GET_PICKED_TASKS_BY_CONTAINER_REQUEST_FAIL,
  GET_PICKED_TASKS_BY_CONTAINER_REQUEST_SUCCESS,
  PICK_PICK_TASK_REQUEST,
  PICK_PICK_TASK_REQUEST_FAIL,
  PICK_PICK_TASK_REQUEST_SUCCESS,
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
    yield put({ type: GET_PICK_TASKS_REQUEST_FAIL, payload: (error as any)?.message || 'Error Fetching Tasks' });
    yield action.callback({ error });
    yield put(hideScreenLoading());
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
    yield put({
      type: GET_PICK_TASK_BY_ID_REQUEST_FAIL,
      payload: (error as any)?.message || 'Error Fetching Pick Task'
    });
    yield action.callback({ error });
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
    yield action.callback({ error });
    yield put(hideScreenLoading());
  }
}

export default function* watcher() {
  yield takeLatest(GET_PICK_TASKS_REQUEST, getPickTasksAction);
  yield takeLatest(START_PICK_TASK_REQUEST, startPickTaskAction);
  yield takeLatest(PICK_PICK_TASK_REQUEST, pickPickTaskAction);
  yield takeLatest(DROP_PICK_TASK_REQUEST, dropPickTaskAction);
  yield takeLatest(GET_PICK_TASK_BY_ID_REQUEST, getPickTaskByIdAction);
  yield takeLatest(GET_PICKED_TASKS_BY_CONTAINER_REQUEST, getPickedTasksByContainerAction);
}
