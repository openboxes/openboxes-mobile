import { takeLatest, put, call } from 'redux-saga/effects';
import {
  FETCH_STOCK_MOVEMENTS,
  FETCH_STOCK_MOVEMENTS_SUCCESS,
  UPDATE_INTERNAL_STOCK_TRANSFER,
  UPDATE_INTERNAL_STOCK_TRANSFER_SUCCESS
} from '../actions/transfers';
import { hideScreenLoading, showScreenLoading } from '../actions/main';
import * as api from '../../apis';
import * as NavigationService from '../../NavigationService';
import * as Sentry from '@sentry/react-native';

function* updateStockTransfer(action: any) {
  try {
    yield put(showScreenLoading('Please wait..'));
    const response: any = yield call(
      api.updateStockTransfers,
      action.payload.data
    );
    yield put({
      type: UPDATE_INTERNAL_STOCK_TRANSFER_SUCCESS,
      payload: response
    });
    yield action.callback(response.data);
    yield NavigationService.navigate('Drawer');
    yield put(hideScreenLoading());
  } catch (e) {
    yield put(hideScreenLoading());
    Sentry.captureException('Error while updateStockTransfer API', e.response);
  }
}

function* getStockMovements(action: any) {
  try {
    yield put(showScreenLoading('Please wait..'));
    const response: any = yield call(api.getStockMovements, action.payload.id);
    yield put({
      type: FETCH_STOCK_MOVEMENTS_SUCCESS,
      payload: response.data
    });
    yield action.callback(response.data);
    yield put(hideScreenLoading());
  } catch (e) {
    Sentry.captureException('Error while getStockMovements API', e.response);
    yield put(hideScreenLoading());
  }
}

export default function* watcher() {
  yield takeLatest(UPDATE_INTERNAL_STOCK_TRANSFER, updateStockTransfer);
  yield takeLatest(FETCH_STOCK_MOVEMENTS, getStockMovements);
}
