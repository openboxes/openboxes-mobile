import { call, put, select, takeLatest } from 'redux-saga/effects';

import * as api from '../../apis';
import { hideScreenLoading, showScreenLoading } from '../actions/main';
import {
  GET_REPLENISHMENT_LISTS_REQUEST,
  GET_REPLENISHMENT_LISTS_REQUEST_FAIL,
  GET_REPLENISHMENT_LISTS_REQUEST_SUCCESS,
  GET_REPLENISHMENT_TASK_BY_ID_REQUEST,
  GET_REPLENISHMENT_TASK_BY_ID_REQUEST_FAIL,
  GET_REPLENISHMENT_TASK_BY_ID_REQUEST_SUCCESS,
  GET_REPLENISHMENT_TASKS_REQUEST,
  GET_REPLENISHMENT_TASKS_REQUEST_FAIL,
  GET_REPLENISHMENT_TASKS_REQUEST_SUCCESS
} from '../actions/replenishment';
import { userLocation } from '../selectors/auth';

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
    const response = yield call(api.getReplenishmentTasksApi, currentLocation.id, action.payload.orderId);
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

export default function* watcher() {
  yield takeLatest(GET_REPLENISHMENT_LISTS_REQUEST, getReplenishmentListsAction);
  yield takeLatest(GET_REPLENISHMENT_TASKS_REQUEST, getReplenishmentTasksAction);
  yield takeLatest(GET_REPLENISHMENT_TASK_BY_ID_REQUEST, getReplenishmentTaskByIdAction);
}
