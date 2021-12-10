import { takeLatest, put, call } from 'redux-saga/effects';
import {
  STOCK_TRANSFERS_REQUEST,
  STOCK_TRANSFERS_REQUEST_SUCCESS
} from '../actions/transfers';
import { hideScreenLoading, showScreenLoading } from '../actions/main';
import * as api from '../../apis';
import * as Sentry from '@sentry/react-native';

function* stockTransfers(action: any) {
  try {
    yield put(showScreenLoading('Please wait...'));
    const response = yield call(api.stockTransfers, action.payload);
    yield put({
      type: STOCK_TRANSFERS_REQUEST_SUCCESS,
      payload: response.data
    });
    yield put(hideScreenLoading());
  } catch (e) {
    yield put(hideScreenLoading());
    Sentry.captureException('Error while getStockMovements API', e.response);
  }
}

export default function* watcher() {
  yield takeLatest(STOCK_TRANSFERS_REQUEST, stockTransfers);
}
