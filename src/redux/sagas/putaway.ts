import { call, put, select, takeLatest } from 'redux-saga/effects';
import {
  CREATE_PUTAWAY_ORDER_REQUEST,
  CREATE_PUTAWAY_ORDER_REQUEST_SUCCESS,
  FETCH_PUTAWAY_FROM_ORDER_REQUEST,
  FETCH_PUTAWAY_FROM_ORDER_REQUEST_SUCCESS,
  GET_PUTAWAY_CANDIDATES_REQUEST,
  GET_PUTAWAY_CANDIDATES_REQUEST_SUCCESS,
  GET_PUTAWAY_DETAILS_BY_CONTAINER_ID_REQUEST,
  GET_PUTAWAY_DETAILS_BY_CONTAINER_ID_REQUEST_SUCCESS,
  PATCH_PUTAWAY_TASK_REQUEST,
  PATCH_PUTAWAY_TASK_REQUEST_SUCCESS,
  SUBMIT_PUTAWAY_ITEM_BIN_LOCATION,
  SUBMIT_PUTAWAY_ITEM_BIN_LOCATION_SUCCESS
} from '../actions/putaways';
import { hideScreenLoading, showScreenLoading } from '../actions/main';
import * as api from '../../apis';
import { GetPutAwaysApiResponse, PostPutAwayItemApiResponse } from '../../data/putaway/PutAway';
import * as Sentry from '@sentry/react-native';
import { userLocation } from '../selectors/auth';

function* fetchPutAwayFromOrder(action: any) {
  try {
    yield put(showScreenLoading('Loading..'));
    const response: GetPutAwaysApiResponse = yield call(api.fetchPutAwayFromOrder, action.payload.q);
    yield put({
      type: FETCH_PUTAWAY_FROM_ORDER_REQUEST_SUCCESS,
      payload: response.data
    });
    yield action.callback(response.data);
    yield put(hideScreenLoading());
  } catch (error) {
    yield put(hideScreenLoading());
    if (error.code != 401) {
      yield action.callback({
        error: true,
        errorMessage: error.message
      });
    }
  }
}

function* submitPutawayItem(action: any) {
  try {
    yield put(showScreenLoading('Please wait..'));
    const response: PostPutAwayItemApiResponse = yield call(
      api.submitPutawayItem,
      action.payload.id,
      action.payload.requestBody
    );
    yield put({
      type: SUBMIT_PUTAWAY_ITEM_BIN_LOCATION_SUCCESS,
      payload: response
    });
    yield action.callback(response);
    yield put(hideScreenLoading());
  } catch (error) {
    yield put(hideScreenLoading());
    if (error.code != 401) {
      yield action.callback({
        error: true,
        errorMessage: error.message
      });
    }
  }
}

function* getCandidates(action: any) {
  try {
    yield put(showScreenLoading('Loading..'));
    const response = yield call(api.getCandidates, action.payload.locationId);
    yield put({
      type: GET_PUTAWAY_CANDIDATES_REQUEST_SUCCESS,
      payload: response.data
    });
    yield put(hideScreenLoading());
  } catch (e) {
    yield put(hideScreenLoading());
    Sentry.captureException('Error while get Candidates API', e.message);
  }
}

function* createPutawayOder(action: any) {
  try {
    yield put(showScreenLoading('Loading..'));
    const response = yield call(api.createPutawayOder, action.payload.data);
    yield put({
      type: CREATE_PUTAWAY_ORDER_REQUEST_SUCCESS,
      payload: response.data
    });
    yield put(hideScreenLoading());
    yield action.callback({ response, message: 'Order created successfully' });
  } catch (error) {
    yield put(hideScreenLoading());
    yield action.callback({
      error: true,
      errorMessage: error.message
    });
  }
}

function* patchPutawayTask(action: any) {
  try {
    yield put(showScreenLoading('Submitting...'));
    const { facilityId, putawayItemId, payload } = action.payload;
    const response = yield call(api.patchPutawayTask, facilityId, putawayItemId, payload);
    yield put({
      type: PATCH_PUTAWAY_TASK_REQUEST_SUCCESS,
      payload: response.data
    });
    yield put(hideScreenLoading());
    yield action.callback({ success: true, data: response.data });
  } catch (error) {
    yield put(hideScreenLoading());
    yield action.callback({
      error: true,
      errorMessage: error.message
    });
  }
}

function* getPutawayDetailsByContainerId(action: any) {
  try {
    const location = yield select(userLocation)
    if (!location || !location.id) {
      return;
    }
    yield put(showScreenLoading('Loading..'));
    const response = yield call(api.getPutawayDetails, location.id, action.payload.containerId);
    yield put({
      type: GET_PUTAWAY_DETAILS_BY_CONTAINER_ID_REQUEST_SUCCESS,
      payload: response.data
    });
    yield put(hideScreenLoading());
    if (action.callback) {
      yield action.callback({ response, message: 'Putaway details fetched successfully' });
    }
  } catch (error) {
    yield put(hideScreenLoading());
    if (action.callback) {
      yield action.callback({
        error: true,
        errorMessage: error.message
      });
    }
  }
}

export default function* watcher() {
  yield takeLatest(FETCH_PUTAWAY_FROM_ORDER_REQUEST, fetchPutAwayFromOrder);
  yield takeLatest(GET_PUTAWAY_CANDIDATES_REQUEST, getCandidates);
  yield takeLatest(CREATE_PUTAWAY_ORDER_REQUEST, createPutawayOder);
  yield takeLatest(SUBMIT_PUTAWAY_ITEM_BIN_LOCATION, submitPutawayItem);
  yield takeLatest(PATCH_PUTAWAY_TASK_REQUEST, patchPutawayTask);
  yield takeLatest(GET_PUTAWAY_DETAILS_BY_CONTAINER_ID_REQUEST, getPutawayDetailsByContainerId);
}
