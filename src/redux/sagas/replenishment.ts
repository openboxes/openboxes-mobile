import { call, put, select, takeLatest } from 'redux-saga/effects';

import * as api from '../../apis';
import { hideScreenLoading, showScreenLoading } from '../actions/main';
import {
  DROP_REPLENISHMENT_CONTAINER_REQUEST,
  DROP_REPLENISHMENT_CONTAINER_REQUEST_FAIL,
  DROP_REPLENISHMENT_CONTAINER_REQUEST_SUCCESS,
  GET_REPLENISHMENT_LISTS_REQUEST,
  GET_REPLENISHMENT_LISTS_REQUEST_FAIL,
  GET_REPLENISHMENT_LISTS_REQUEST_SUCCESS,
  GET_REPLENISHMENT_TASK_BY_ID_REQUEST,
  GET_REPLENISHMENT_TASK_BY_ID_REQUEST_FAIL,
  GET_REPLENISHMENT_TASK_BY_ID_REQUEST_SUCCESS,
  GET_REPLENISHMENT_TASKS_REQUEST,
  GET_REPLENISHMENT_TASKS_REQUEST_FAIL,
  GET_REPLENISHMENT_TASKS_REQUEST_SUCCESS,
  PICK_REPLENISHMENT_TASK_REQUEST,
  PICK_REPLENISHMENT_TASK_REQUEST_FAIL,
  PICK_REPLENISHMENT_TASK_REQUEST_SUCCESS,
  SHORT_PICK_REPLENISHMENT_TASK_REQUEST,
  SHORT_PICK_REPLENISHMENT_TASK_REQUEST_FAIL,
  SHORT_PICK_REPLENISHMENT_TASK_REQUEST_SUCCESS,
  START_REPLENISHMENT_TASK_REQUEST,
  START_REPLENISHMENT_TASK_REQUEST_FAIL,
  START_REPLENISHMENT_TASK_REQUEST_SUCCESS
} from '../actions/replenishment';
import { userLocation, userSession } from '../selectors/auth';

function* getReplenishmentListsAction(action: any) {
  const showLoader = !action.payload?.silent;
  try {
    // @ts-ignore
    const currentLocation = yield select(userLocation);
    if (!currentLocation) {
      throw new Error('User Location Not Found');
    }
    if (showLoader) {
      yield put(showScreenLoading('Fetching Replenishments...'));
    }
    // @ts-ignore
    const response = yield call(api.getReplenishmentListsApi, currentLocation.id);
    yield action.callback({ response });
    yield put({ type: GET_REPLENISHMENT_LISTS_REQUEST_SUCCESS, payload: response.data });
  } catch (error) {
    const errorMessage = (error as any)?.message || 'Error Fetching Replenishments';
    yield put({ type: GET_REPLENISHMENT_LISTS_REQUEST_FAIL, payload: errorMessage });
    yield action.callback({ errorMessage });
  } finally {
    if (showLoader) {
      yield put(hideScreenLoading());
    }
  }
}

function* getReplenishmentTasksAction(action: any) {
  try {
    // @ts-ignore
    const currentLocation = yield select(userLocation);
    if (!currentLocation) {
      throw new Error('User Location Not Found');
    }
    yield put(showScreenLoading('Fetching Tasks...'));
    // @ts-ignore
    const response = yield call(
      api.getReplenishmentTasksApi,
      currentLocation.id,
      action.payload.orderId,
      action.payload.statuses
    );
    yield action.callback({ response });
    yield put({ type: GET_REPLENISHMENT_TASKS_REQUEST_SUCCESS, payload: response.data });
  } catch (error) {
    const errorMessage = (error as any)?.message || 'Error Fetching Replenishment Tasks';
    yield put({ type: GET_REPLENISHMENT_TASKS_REQUEST_FAIL, payload: errorMessage });
    yield action.callback({ errorMessage });
  } finally {
    yield put(hideScreenLoading());
  }
}

function* getReplenishmentTaskByIdAction(action: any) {
  try {
    // @ts-ignore
    const currentLocation = yield select(userLocation);
    if (!currentLocation) {
      throw new Error('User Location Not Found');
    }
    yield put(showScreenLoading('Fetching Task...'));
    // @ts-ignore
    const response = yield call(api.getReplenishmentTaskByIdApi, currentLocation.id, action.payload.taskId);
    yield action.callback({ response });
    yield put({ type: GET_REPLENISHMENT_TASK_BY_ID_REQUEST_SUCCESS, payload: response.data });
  } catch (error) {
    const errorMessage = (error as any)?.message || 'Error Fetching Replenishment Task';
    yield put({ type: GET_REPLENISHMENT_TASK_BY_ID_REQUEST_FAIL, payload: errorMessage });
    yield action.callback({ errorMessage });
  } finally {
    yield put(hideScreenLoading());
  }
}

function* startReplenishmentTaskAction(action: any) {
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
    // @ts-ignore
    const response = yield call(api.patchReplenishmentTaskApi, currentLocation.id, action.payload.taskId, {
      action: 'start',
      assigneeId: session.user.id
    });
    yield action.callback({ response });
    yield put({ type: START_REPLENISHMENT_TASK_REQUEST_SUCCESS, payload: response?.data });
  } catch (error) {
    const errorMessage = (error as any)?.message || 'Error Starting Replenishment Task';
    yield put({ type: START_REPLENISHMENT_TASK_REQUEST_FAIL, payload: errorMessage });
    yield action.callback({ errorMessage });
  }
}

function* pickReplenishmentTaskAction(action: any) {
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
    // @ts-ignore
    const response = yield call(api.patchReplenishmentTaskApi, currentLocation.id, action.payload.taskId, {
      action: 'pick',
      outboundContainerId: action.payload.outboundContainerId,
      pickedById: session.user.id
    });
    yield action.callback({ response });
    yield put({ type: PICK_REPLENISHMENT_TASK_REQUEST_SUCCESS, payload: response?.data });
  } catch (error) {
    const errorMessage = (error as any)?.message || 'Error Picking Replenishment Task';
    yield put({ type: PICK_REPLENISHMENT_TASK_REQUEST_FAIL, payload: errorMessage });
    yield action.callback({ errorMessage });
  } finally {
    yield put(hideScreenLoading());
  }
}

function* shortPickReplenishmentTaskAction(action: any) {
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
    yield put(showScreenLoading('Shorting Task...'));
    const { taskId, outboundContainerId, quantityPicked, reasonCodeName } = action.payload;
    // @ts-ignore
    const response = yield call(api.patchReplenishmentTaskApi, currentLocation.id, taskId, {
      action: 'short-pick',
      outboundContainerId,
      quantityPicked,
      pickedById: session.user.id,
      reasonCode: reasonCodeName ? { name: reasonCodeName } : undefined
    });
    yield action.callback({ response });
    yield put({ type: SHORT_PICK_REPLENISHMENT_TASK_REQUEST_SUCCESS, payload: response?.data });
  } catch (error) {
    const errorMessage = (error as any)?.message || 'Error Shorting Replenishment Task';
    yield put({ type: SHORT_PICK_REPLENISHMENT_TASK_REQUEST_FAIL, payload: errorMessage });
    yield action.callback({ errorMessage });
  } finally {
    yield put(hideScreenLoading());
  }
}

function* dropReplenishmentContainerAction(action: any) {
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
    yield put(showScreenLoading('Staging Container...'));
    const { outboundContainerId, stagingLocationId } = action.payload;
    // @ts-ignore
    const response = yield call(api.dropReplenishmentContainerApi, currentLocation.id, outboundContainerId, {
      action: 'drop',
      stagingLocationId,
      stagedById: session.user.id
    });
    yield action.callback({ response });
    yield put({ type: DROP_REPLENISHMENT_CONTAINER_REQUEST_SUCCESS, payload: response?.data });
  } catch (error) {
    const errorMessage = (error as any)?.message || 'Error Staging Replenishment Container';
    yield put({ type: DROP_REPLENISHMENT_CONTAINER_REQUEST_FAIL, payload: errorMessage });
    yield action.callback({ errorMessage });
  } finally {
    yield put(hideScreenLoading());
  }
}

export default function* watcher() {
  yield takeLatest(GET_REPLENISHMENT_LISTS_REQUEST, getReplenishmentListsAction);
  yield takeLatest(GET_REPLENISHMENT_TASKS_REQUEST, getReplenishmentTasksAction);
  yield takeLatest(GET_REPLENISHMENT_TASK_BY_ID_REQUEST, getReplenishmentTaskByIdAction);
  yield takeLatest(START_REPLENISHMENT_TASK_REQUEST, startReplenishmentTaskAction);
  yield takeLatest(PICK_REPLENISHMENT_TASK_REQUEST, pickReplenishmentTaskAction);
  yield takeLatest(SHORT_PICK_REPLENISHMENT_TASK_REQUEST, shortPickReplenishmentTaskAction);
  yield takeLatest(DROP_REPLENISHMENT_CONTAINER_REQUEST, dropReplenishmentContainerAction);
}
