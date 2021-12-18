import { call, put, takeLatest } from 'redux-saga/effects';
import {
  CREATE_PUTAWAY_ORDER_REQUEST,
  CREATE_PUTAWAY_ORDER_REQUEST_SUCCESS,
  FETCH_PUTAWAY_FROM_ORDER_REQUEST,
  FETCH_PUTAWAY_FROM_ORDER_REQUEST_SUCCESS,
  GET_PUTAWAY_CANDIDATES_REQUEST,
  GET_PUTAWAY_CANDIDATES_REQUEST_SUCCESS,
  SUBMIT_PUTAWAY_ITEM_BIN_LOCATION,
  SUBMIT_PUTAWAY_ITEM_BIN_LOCATION_SUCCESS
} from '../actions/putaways';
import { hideScreenLoading, showScreenLoading } from '../actions/main';
import * as api from '../../apis';
import {
  GetPutAwaysApiResponse,
  PostPutAwayItemApiResponse
} from '../../data/putaway/PutAway';
import * as Sentry from '@sentry/react-native';

function* fetchPutAwayFromOrder(action: any) {
  try {
    yield put(showScreenLoading('Loading..'));
    const response: GetPutAwaysApiResponse = yield call(
      api.fetchPutAwayFromOrder,
      action.payload.q
    );
    yield put({
      type: FETCH_PUTAWAY_FROM_ORDER_REQUEST_SUCCESS,
      payload: response.data
    });
    yield action.callback(response.data);
    yield put(hideScreenLoading());
  } catch (error) {
    if (error.code != 401) {
      yield action.callback({
        error: true,
        message: errorMessage
      });
    }
  }
}

function* submitPutawayItem(action: any) {
  try {
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
  } catch (error) {
    if (error.code != 401) {
      yield action.callback({
        error: true,
        message: errorMessage
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
    Sentry.captureException('Error while get Candidates API', e.response);
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
      message: errorMessage,
      error: true
    });
  }
}

export default function* watcher() {
  yield takeLatest(FETCH_PUTAWAY_FROM_ORDER_REQUEST, fetchPutAwayFromOrder);
  yield takeLatest(GET_PUTAWAY_CANDIDATES_REQUEST, getCandidates);
  yield takeLatest(CREATE_PUTAWAY_ORDER_REQUEST, createPutawayOder);
  yield takeLatest(SUBMIT_PUTAWAY_ITEM_BIN_LOCATION, submitPutawayItem);
}
