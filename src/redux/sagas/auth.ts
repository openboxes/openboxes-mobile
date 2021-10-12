import {takeLatest, put, call} from 'redux-saga/effects';
import {LOGIN_REQUEST, LOGIN_REQUEST_SUCCESS} from '../actions/auth';
import * as NavigationService from '../../NavigationService';

import * as api from '../../apis';
import {
  GET_SESSION_REQUEST,
  hideScreenLoading,
  showScreenLoading,
} from '../actions/main';
import GetSessionApiResponse from '../../data/auth/Session';

function* getSession() {
  try {
    yield showScreenLoading('"Fetching session details"');
    const response: GetSessionApiResponse = yield call(api.getSession);
    yield put({
      type: GET_SESSION_REQUEST,
      payload: response.data,
    });
    yield hideScreenLoading();
  } catch (e) {
    console.log('function* auth', e.response);
  }
}

function* login(action: any) {
  try {
    yield put(showScreenLoading('Logging in'));
    const data = yield call(api.login, action.payload.data);
    yield put({
      type: LOGIN_REQUEST_SUCCESS,
      payload: data,
    });
    yield NavigationService.navigate('ChooseCurrentLocation');
    yield put(hideScreenLoading());
  } catch (e) {
    console.log('function* auth', e.response);
  }
}

export default function* watcher() {
  yield takeLatest(GET_SESSION_REQUEST, getSession);
  yield takeLatest(LOGIN_REQUEST, login);
}
