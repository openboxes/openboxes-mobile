/* eslint-disable complexity */
/* eslint-disable no-restricted-syntax */
import { takeLatest, put, call } from 'redux-saga/effects';
import {
  LOGIN_REQUEST,
  LOGIN_REQUEST_SUCCESS,
  LOGOUT_REQUEST,
  LOGOUT_REQUEST_SUCCESS
} from '../actions/auth';
import * as NavigationService from '../../NavigationService';
import showPopup from '../../components/Popup';

import * as api from '../../apis';
import {
  GET_SESSION_REQUEST,
  GET_SESSION_REQUEST_SUCCESS,
  hideScreenLoading,
  showScreenLoading
} from '../actions/main';
import GetSessionApiResponse from '../../data/auth/Session';

function* getSession() {
  try {
    yield put(showScreenLoading('Loading..'));
    const response: GetSessionApiResponse = yield call(api.getSession);
    yield put({
      type: GET_SESSION_REQUEST_SUCCESS,
      payload: response.data
    });
    yield put(hideScreenLoading());
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
      payload: data
    });
    yield NavigationService.navigate('Drawer');
    yield put(hideScreenLoading());
  } catch (e) {
    console.log('function* auth', e.response);
    yield put(hideScreenLoading());
    if (e.response) {
      console.debug('e.response status:' + e.response.status);
      if (e.response.status == 401) {
        showPopup({
          message: 'Invalid Username and Password',
          positiveButton: 'ok'
        });
      } else if (e.response.status == 500) {
        showPopup({
          message: 'Something went wrong on server',
          positiveButton: 'ok'
        });
      } else if (e.response.status == 404) {
        showPopup({ message: 'Server unavailable', positiveButton: 'ok' });
      }
    } else {
      showPopup({ message: 'Server unavailable', positiveButton: 'ok' });
    }
  }
}
function* logout(action: any) {
  try {
    yield put(showScreenLoading('Logging out'));
    const data = yield call(api.logout, action.payload.data);
    yield put({
      type: LOGOUT_REQUEST_SUCCESS,
      payload: data
    });
    yield NavigationService.navigate('Login');
    yield put(hideScreenLoading());
  } catch (e) {
    console.log('function* auth', e.response);
    yield put(hideScreenLoading());
    if (e.response) {
      console.debug('e.response status:' + e.response.status);
      if (e.response.status === 401) {
        showPopup({
          message: 'Invalid Username and Password',
          positiveButton: 'ok'
        });
      } else if (e.response.status === 500) {
        showPopup({
          message: 'Something went wrong on server',
          positiveButton: 'ok'
        });
      } else if (e.response.status === 404) {
        showPopup({ message: 'Server unavailable', positiveButton: 'ok' });
      }
    } else {
      showPopup({ message: 'Server unavailable', positiveButton: 'ok' });
    }
  }
}
export default function* watcher() {
  yield takeLatest(GET_SESSION_REQUEST, getSession);
  yield takeLatest(LOGIN_REQUEST, login);
  yield takeLatest(LOGOUT_REQUEST, logout);
}
