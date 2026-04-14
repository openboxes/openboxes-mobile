import { takeLatest, put, call } from 'redux-saga/effects';
import {
  FETCH_STOCK_MOVEMENTS,
  FETCH_STOCK_MOVEMENTS_SUCCESS,
  UPDATE_INTERNAL_STOCK_TRANSFER,
  UPDATE_INTERNAL_STOCK_TRANSFER_SUCCESS
} from '../actions/transfers';
import * as api from '../../apis';
import * as Sentry from '@sentry/react-native';

function* updateStockTransfer(action: any) {
  try {
    const response: any = yield call(
      api.updateStockTransfers,
      action.payload.data
    );
    yield put({
      type: UPDATE_INTERNAL_STOCK_TRANSFER_SUCCESS,
      payload: response
    });
    yield action.callback(response.data);
  } catch (e) {
    yield action.callback({
      error: true,
      errorMessage: e.message,
    });
    Sentry.captureException('Error while updateStockTransfer API', e.message);
  }
}

function* getStockMovements(action: any) {
  try {
    const response: any = yield call(api.getStockMovements, action.payload.id);
    yield put({
      type: FETCH_STOCK_MOVEMENTS_SUCCESS,
      payload: response.data
    });
    yield action.callback(response.data);
  } catch (e) {
    Sentry.captureException('Error while getStockMovements API', e.message);
  }
}

export default function* watcher() {
  yield takeLatest(UPDATE_INTERNAL_STOCK_TRANSFER, updateStockTransfer);
  yield takeLatest(FETCH_STOCK_MOVEMENTS, getStockMovements);
}
