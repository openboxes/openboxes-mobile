import {takeLatest, put, call} from 'redux-saga/effects';
import {
  GET_ORDERS_REQUEST,
  GET_ORDERS_REQUEST_SUCCESS,
  GET_PICKLIST_REQUEST,
  GET_PICKLIST_ITEM_REQUEST,
  SUBMIT_PICKLIST_ITEM_PICKUP_REQUEST
} from '../actions/orders';
import {hideScreenLoading, showScreenLoading} from '../actions/main';
import * as api from '../../apis';
import GetOrdersApiResponse from '../../data/order/Order';
import {GET_LOCATIONS_REQUEST_SUCCESS} from '../actions/locations';
import GetPickListApiResponse from '../../data/picklist/Item';
import {GetPickListItemApiResponse, GetPickListItemsApiResponse} from "../../data/picklist/PicklistItem";

function* getOrders(action: any) {
  try {
    yield showScreenLoading('Fetching products');
    const response: GetOrdersApiResponse = yield call(api.getOrders, action.payload);
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
    const response: GetPickListItemsApiResponse = yield call(
      api.getPickList,
      action.payload.id,
    );
    yield put({
      type: GET_LOCATIONS_REQUEST_SUCCESS,
      payload: response.data,
    });
    yield action.callback(response.data);
  } catch (e) {
    console.log('function* getPickList', e.message);
    yield action.callback({
      error: true,
      message: e.message,
    });
  }
}
function* getPickListItem(action: any) {
  try {
    const response: GetPickListItemApiResponse = yield call(
      api.getPickListItem,
      action.payload.id,
    );
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

function* submitPickListItem(action: any) {
  try {
    const response: GetPickListItemApiResponse = yield call(
        api.submitPickListItem,
        action.payload.id,
        action.payload.requestBody,
    );
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
  yield takeLatest(GET_PICKLIST_ITEM_REQUEST, getPickListItem);
  yield takeLatest(SUBMIT_PICKLIST_ITEM_PICKUP_REQUEST, submitPickListItem);
}
