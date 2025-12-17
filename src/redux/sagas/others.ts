import { call, put, takeLatest } from 'redux-saga/effects';
import { GET_REASON_CODES_REQUEST, GET_REASON_CODES_REQUEST_SUCCESS } from '../actions/others';
import * as api from '../../apis';
import { hideScreenLoading, showScreenLoading } from '../actions/main';

function* getReasonCodes(action: any) {
  try {
    yield put(showScreenLoading('Loading Reasons...'));

    const response = yield call(api.getReasonCodesByActivity, action.payload.activityCode);

    yield put({
      type: GET_REASON_CODES_REQUEST_SUCCESS,
      payload: response.data
    });

    if (action.callback) {
      yield call(action.callback, response.data);
    }

    yield put(hideScreenLoading());
  } catch (error) {
    if (action.callback) {
      yield call(action.callback, {
        error: true,
        errorMessage: error.message ?? 'Failed To Load Reason Codes'
      });
    }
    yield put(hideScreenLoading());
  }
}

export default function* watcher() {
  yield takeLatest(GET_REASON_CODES_REQUEST, getReasonCodes);
}
