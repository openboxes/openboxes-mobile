import {call, put, takeLatest} from 'redux-saga/effects';
import * as api from '../../apis';
import {
  FETCH_CONTAINER_DETAIL,
  FETCH_CONTAINER_DETAIL_RESPONSE_SUCCESS,
  GET_CONTAINER_DETAIL,
  GET_CONTAINER_DETAIL_RESPONSE_SUCCESS,
  SAVE_OR_UPDATE_LPN,
  GET_CONTAINER_STATUS_DETAIL,
  GET_CONTAINER_STATUS_DETAIL_RESPONSE_SUCCESS,
} from '../actions/lpn';
import {handleError} from './error';

function* saveAndUpdateLpn(action: any) {
  try {
    console.log('sagas saveAndUpdateLpn');
    const response: any = yield call(
      api.saveAndUpdateLpn,
      action.payload.requestBody,
    );

    yield action.callback(response.data);
  } catch (e) {
    console.log('function* saveAndUpdateLpn', e.message);
    handleError(e);
  }
}

function* fetchContainer(action: any) {
  try {
    const response = yield call(api.fetchContainer, action.payload.id);
    console.log(response);
    yield put({
      type: FETCH_CONTAINER_DETAIL_RESPONSE_SUCCESS,
      payload: response.data,
    });
    yield action.callback(response.data);
  } catch (e) {
    yield action.callback({
      error: true,
      errorMessage: e.message,
    });
  }
}

function* getContainerDetail(action: any) {
  try {
    const response = yield call(api.getContainerDetail, action.payload.id);
    console.log(response);
    yield put({
      type: GET_CONTAINER_DETAIL_RESPONSE_SUCCESS,
      payload: response.data,
    });
    yield action.callback(response.data);
  } catch (e) {
    console.log('function* getContainer', e.message);
    yield action.callback({
      error: true,
      errorMessage: e.message,
    });
  }
}

function* updateContainerStatus(action: any) {
    try {
        console.log("sagas getStatusDetails:" + action.payload.id)
        const response = yield call(
            api.updateContainerStatus,
            action.payload.id,
            action.payload.status
        );
        console.log(response.data)
        yield put({
            type: GET_CONTAINER_STATUS_DETAIL_RESPONSE_SUCCESS,
            payload: response.data,
        });
        yield action.callback(response.data);
    } catch (e) {
        console.log('function* getStatusDetails', e.message);
        yield action.callback({
            error: true,
            errorMessage: e.message,
        });
    }
}

export default function* watcher() {
  yield takeLatest(SAVE_OR_UPDATE_LPN, saveAndUpdateLpn);
  yield takeLatest(FETCH_CONTAINER_DETAIL, fetchContainer);
  yield takeLatest(GET_CONTAINER_DETAIL, getContainerDetail);
  yield takeLatest(GET_CONTAINER_STATUS_DETAIL, updateContainerStatus);
}
