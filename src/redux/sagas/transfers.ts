import { takeLatest, put, call } from 'redux-saga/effects';
import {
  STOCK_TRANSFERS_REQUEST,
  STOCK_TRANSFERS_REQUEST_SUCCESS,
  FETCH_STOCK_TRANSFERS,
  FETCH_STOCK_TRANSFERS_SUCCESS,
  FETCH_STOCK_TRANSFERS_DETAILS,
  POST_COMPLETE_STOCK_TRANSFER
} from '../actions/transfers';
import * as api from '../../apis';
import * as Sentry from '@sentry/react-native';
import { parseResponse } from '../../utils/utils';

function* stockTransfers(action: any) {
  try {
    const response = yield call(api.stockTransfers, action.payload);
    yield put({
      type: STOCK_TRANSFERS_REQUEST_SUCCESS,
      payload: response.data
    });
  } catch (e) {
    Sentry.captureException('Error while getStockMovements API', e.message);
  }
}

function* getStockTransfers(action: any) {
  try {
    const response = yield call(api.getStockTransfers, action.payload);
    yield put({
      type: FETCH_STOCK_TRANSFERS_SUCCESS,
      payload: response.data
    });
    yield action.callback(response.data);
  } catch (e) {
    Sentry.captureException('Error while getStockTransfers API', e.message);
    yield action.callback({ error: true, errorMessage: e.message });
  }
}

function* getStockTransfersSummary(action: any) {
  try {
    const response = yield call(api.fetchStockTransferSummary, action.payload.id);
    const parsedResponse = parseResponse(response.data);
    yield action.callback(parsedResponse);
  } catch (e) {
    Sentry.captureException('Error while stockTransfers details', e.message);
    yield action.callback({
      error: true,
      errorMessage: e.message
    });
  }
}

function* completeStockTransfer(action: any) {
  try {
    const response = yield call(api.completeStockTransfer, action.payload);
    yield action.callback(response.data);
  } catch (e) {
    Sentry.captureException('Error while completing Transfer', e.message);
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
