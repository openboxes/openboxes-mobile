import { takeLatest, put, call } from 'redux-saga/effects';
import {
  GET_CONTAINER_DETAILS_REQUEST,
  GET_CONTAINER_DETAILS_SUCCESS,
  GET_SHIPMENT_ORIGIN_REQUEST,
  GET_SHIPMENT_ORIGIN_SUCCESS,
  GET_SHIPMENT_PACKING_REQUEST,
  GET_SHIPMENT_PACKING_SUCCESS,
  GET_SHIPMENT_READY_TO_BE_PACKED,
  GET_SHIPMENTS_READY_TO_BE_PACKED,
  GET_SUBMIT_SHIPMENT_DETAILS_REQUEST,
  GET_SUBMIT_SHIPMENT_DETAILS_SUCCESS,
  GET_SHIPMENT_TYPE_REQUEST,
  GET_SHIPMENT_TYPE_SUCCESS
} from '../actions/packing';
import { hideScreenLoading, showScreenLoading } from '../actions/main';
import * as api from '../../apis';
import ShipmentsReadyToPackedResponse, {
  ShipmentReadyToPackedResponse
} from '../../data/container/Shipment';
import showPopup from '../../components/Popup';
import * as Sentry from '@sentry/react-native';

function* getShipmentsReadyToBePacked(action: any) {
  try {
    yield put(showScreenLoading('Please wait...'));
    const response: ShipmentsReadyToPackedResponse = yield call(
      api.getShipmentsReadyToBePacked,
      action.payload.locationId,
      action.payload.shipmentStatusCode
    );
    yield put({
      type: GET_SHIPMENT_PACKING_SUCCESS,
      payload: response.data
    });
    yield action.callback(response.data);
    yield put(hideScreenLoading());
  } catch (e) {
    Sentry.captureException(
      'Error while getShipmentsReadyToBePacked API',
      e.message
    );
    yield put(hideScreenLoading());
  }
}

function* getShipmentReadyToBePacked(action: any) {
  try {
    yield put(showScreenLoading('Please wait...'));
    const response: ShipmentReadyToPackedResponse = yield call(
      api.getShipmentReadyToBePacked,
      action.payload.id
    );
    yield put({
      type: GET_SHIPMENT_PACKING_SUCCESS,
      payload: response.data
    });
    yield action.callback(response.data);
    yield put(hideScreenLoading());
  } catch (e) {
    Sentry.captureException(
      'Error while getShipmentReadyToBePacked API',
      e.message
    );
    yield put(hideScreenLoading());
  }
}

function* getShipmentPacking(action: any) {
  try {
    yield put(showScreenLoading('Please wait...'));
    const response = yield call(api.getShipmentPacking, action.payload.id);
    yield put({
      type: GET_SHIPMENT_PACKING_SUCCESS,
      payload: response.data
    });
    yield action.callback(response.data);
    yield put(hideScreenLoading());
  } catch (e) {
    yield put(hideScreenLoading());
    Sentry.captureException('Error while getShipmentPacking API', e.message);
  }
}

function* getShipmentOriginById(action: any) {
  try {
    yield put(showScreenLoading('Loading...'));
    const response = yield call(api.getShipmentOrigin, action.payload.id);
    yield put({
      type: GET_SHIPMENT_ORIGIN_SUCCESS,
      payload: response.data
    });
    yield action.callback(response.data);
    yield put(hideScreenLoading());
  } catch (e) {
    yield put(hideScreenLoading());
    Sentry.captureException(
      'Error while getShipmentOriginById API',
      e.message
    );
  }
}

function* getContainerDetail(action: any) {
  try {
    yield put(showScreenLoading('Please wait...'));
    const response = yield call(api.getContainerDetails, action.payload.id);
    yield put({
      type: GET_CONTAINER_DETAILS_SUCCESS,
      payload: response.data
    });
    yield action.callback(response.data);
    yield put(hideScreenLoading());
  } catch (e) {
    yield put(hideScreenLoading());
    Sentry.captureException(
      'Error while get Container Details API',
      e.message
    );
  }
}

function* getContainerType(action: any) {
  try {
    yield put(showScreenLoading('Please wait..'));
    const response = yield call(api.getContainerType);
    yield put({
      type: GET_SHIPMENT_TYPE_SUCCESS,
      payload: response.data
    });
    yield action.callback(response.data);
    yield put(hideScreenLoading());
  } catch (e) {
    yield put(hideScreenLoading());
    Sentry.captureException('Error while getContainerType API', e.message);
  }
}

function* submitShipmentItems(action: any) {
  try {
    yield put(showScreenLoading('Please wait...'));
    const response = yield call(
      api.submitShipmentItems,
      action.payload.id,
      action.payload.requestBody
    );
    yield put({
      type: GET_SUBMIT_SHIPMENT_DETAILS_SUCCESS,
      payload: response
    });
    yield action.callback(response);
    yield put(hideScreenLoading());
  } catch (e) {
    yield put(hideScreenLoading());
    yield action.callback({
      error: true,
      errorMessage: e.message,
    });
    Sentry.captureException('Error while submit ShipmentItems API', e.message);
  }
}

export default function* watcher() {
  yield takeLatest(
    GET_SHIPMENTS_READY_TO_BE_PACKED,
    getShipmentsReadyToBePacked
  );
  yield takeLatest(GET_SHIPMENT_READY_TO_BE_PACKED, getShipmentReadyToBePacked);
  yield takeLatest(GET_SHIPMENT_PACKING_REQUEST, getShipmentPacking);
  yield takeLatest(GET_CONTAINER_DETAILS_REQUEST, getContainerDetail);
  yield takeLatest(GET_SUBMIT_SHIPMENT_DETAILS_REQUEST, submitShipmentItems);
  yield takeLatest(GET_SHIPMENT_ORIGIN_REQUEST, getShipmentOriginById);
  yield takeLatest(GET_SHIPMENT_TYPE_REQUEST, getContainerType);
}
