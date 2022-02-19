import { takeLatest, put, call } from 'redux-saga/effects';
import {
  STOCK_TRANSFERS_REQUEST,
  STOCK_TRANSFERS_REQUEST_SUCCESS,
  FETCH_STOCK_TRANSFERS,
  FETCH_STOCK_TRANSFERS_SUCCESS,
  FETCH_STOCK_TRANSFERS_DETAILS,
  POST_COMPLETE_STOCK_TRANSFER
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
    Sentry.captureException('Error while getStockMovements API', e.message);
  }
}

function* getStockTransfers(action: any) {
  try {
    yield put(showScreenLoading('Please wait...'));
    const response = yield call(api.getStockTransfers, action.payload);
    yield put({
      type: FETCH_STOCK_TRANSFERS_SUCCESS,
      payload: response.data
    });
    yield action.callback(response.data);
    yield put(hideScreenLoading());
  } catch (e) {
    yield put(hideScreenLoading());
    Sentry.captureException('Error while getStockMovements API', e.message);
  }
}

function* getStockTransfersSummary(action: any) {
  try {
    yield put(showScreenLoading('Loading...'));
    const response = yield call(
      api.fetchStockTransferSummary,
      action.payload.id
    );
    yield action.callback(response.data);
    yield put(hideScreenLoading());
  } catch (e) {
    Sentry.captureException('Error while stockTransfers details', e.message);
    yield put(hideScreenLoading());
    yield action.callback({
      error: true,
      errorMessage: e.message
    });
  }
}

function* completeStockTransfer(action: any) {
  try {
    yield put(showScreenLoading('Please wait...'));
    const response = yield call(
      api.completeStockTransfer,
      action.payload.id
    );
    yield action.callback(response.data);
    yield put(hideScreenLoading());
  } catch (e) {
    Sentry.captureException('Error while completing Transfer', e.message);
    yield put(hideScreenLoading());
    yield action.callback({
      error: true,
      errorMessage: e.message
    });
  }
}

export default function* watcher() {
  yield takeLatest(STOCK_TRANSFERS_REQUEST, stockTransfers);
  yield takeLatest(FETCH_STOCK_TRANSFERS_DETAILS, getStockTransfersSummary);
  yield takeLatest(FETCH_STOCK_TRANSFERS, getStockTransfers);
  yield takeLatest(POST_COMPLETE_STOCK_TRANSFER, completeStockTransfer);
}
