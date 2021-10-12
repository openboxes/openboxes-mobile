import {takeLatest, put, call} from 'redux-saga/effects';
import {
  GET_ORDERS_REQUEST,
  GET_ORDERS_REQUEST_SUCCESS,
  GET_PICKLIST_REQUEST,
} from '../actions/orders';
import {hideScreenLoading, showScreenLoading} from '../actions/main';
import * as api from '../../apis';
import GetOrdersApiResponse from '../../data/order/Order';
import {GET_LOCATIONS_REQUEST_SUCCESS} from '../actions/locations';
import GetPickListApiResponse from '../../data/picklist/Item';

function* getOrders(action: any) {
  try {
    yield showScreenLoading('Fetching products');
    const response: GetOrdersApiResponse = yield call(api.getOrders);
    yield put({
      type: GET_ORDERS_REQUEST_SUCCESS,
      payload: response.data,
    });
    yield action.callback(response.data);
    yield hideScreenLoading();
  } catch (e) {
    console.log('function* getProducts', e.message);
    yield action.callback({
      error: true,
      message: e.message,
    });
  }
}

function* getPickList(action: any) {
  try {
    const response: GetPickListApiResponse = yield call(
      api.getPickList,
      action.payload.id,
    );
    console.log(7777777777, response.data);
    yield put({
      type: GET_LOCATIONS_REQUEST_SUCCESS,
      payload: response.data,
    });
    yield action.callback(response.data);
  } catch (e) {
    console.log('function* getProducts', e.message);
    yield action.callback({
      error: true,
      message: e.message,
    });
  }
}

export default function* watcher() {
  yield takeLatest(GET_ORDERS_REQUEST, getOrders);
  yield takeLatest(GET_PICKLIST_REQUEST, getPickList);
}
