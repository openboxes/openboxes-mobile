import { hideScreenLoading, showScreenLoading } from '../actions/main';
import { call, put, takeLatest } from 'redux-saga/effects';
import * as api from '../../apis';
import {
  GET_LOCATIONS_REQUEST,
  GET_LOCATIONS_REQUEST_SUCCESS,
  SET_CURRENT_LOCATION_REQUEST,
  SET_CURRENT_LOCATION_REQUEST_SUCCESS,
  GET_INTERNAL_LOCATION_FROM_NUMBER,
  GET_INTERNAL_LOCATIONS_SUCCESS,
  GET_LOCATION_FROM_NUMBER,
  GET_BIN_LOCATIONS_REQUEST,
  GET_BIN_LOCATIONS_REQUEST_SUCCESS,
  GET_INTERNAL_LOCATIONS_DETAIL_SUCCESS,
  GET_INTERNAL_LOCATION_DETAIL,
  GET_PRODUCT_SUMMARY_FROM_LOCATION,
  GET_PRODUCT_SUMMARY_FROM_LOCATION_SUCCESS,
  GET_INTERNAL_LOCATION_DETAIL_SUCCESS,
  GET_INTERNAL_LOCATION_DETAIL_REQUEST
} from '../actions/locations';
import * as Sentry from '@sentry/react-native';

function* getLocations(action: any) {
  try {
    yield put(showScreenLoading('Please wait...'));
    const response = yield call(api.getLocations);
    yield put({
      type: GET_LOCATIONS_REQUEST_SUCCESS,
      payload: response.data
    });
    yield action.callback(response.data);
    yield put(hideScreenLoading());
  } catch (error) {
    if (error.code != 401) {
      yield action.callback({
        error: true,
        message: errorMessage
      });
    }
  }
}

function* setCurrentLocation(action: any) {
  try {
    yield put(showScreenLoading('Please wait...'));
    const response = yield call(
      api.setCurrentLocation,
      action.payload.location
    );
    yield put({
      type: SET_CURRENT_LOCATION_REQUEST_SUCCESS,
      payload: action.payload
    });
    yield action.callback(action.payload.location);
    yield put(hideScreenLoading());
  } catch (error) {
    yield put(hideScreenLoading());
    if (error.code !== 401) {
      yield action.callback({
        error: true,
        message: errorMessage
      });
    }
  }
}

function* searchLocationByLocationNumber(action: any) {
  try {
    yield put(showScreenLoading('Please wait...'));
    const response = yield call(
      api.searchLocationByLocationNumber,
      action.payload.locationNumber
    );
    yield put({
      type: GET_LOCATIONS_REQUEST_SUCCESS,
      payload: response.data
    });
    yield action.callback(response.data);
    yield put(hideScreenLoading());
  } catch (error) {
    if (error.code != 401) {
      yield action.callback({
        error: true,
        message: errorMessage
      });
    }
  }
}

function* getInternalLocations(action: any) {
  try {
    yield put(showScreenLoading('Please wait...'));
    const response = yield call(api.internalLocations, action.payload.location);
    yield put({
      type: GET_INTERNAL_LOCATIONS_SUCCESS,
      payload: response.data
    });
    yield action.callback(response);
    yield put(hideScreenLoading());
  } catch (e) {
    yield action.callback({
      error: true,
      message: e.message
    });
  }
}

function* getInternalLocationsDetails(action: any) {
  try {
    yield put(showScreenLoading('Loading...'));
    const response = yield call(
      api.internalLocationsDetails,
      action.payload.id,
      action.payload.location
    );
    yield put({
      type: GET_INTERNAL_LOCATIONS_DETAIL_SUCCESS,
      payload: response.data
    });
    yield action.callback(response);
    yield put(hideScreenLoading());
  } catch (e) {
    yield action.callback({
      error: true,
      message: e.message
    });
  }
}

function* getInternalLocationDetails(action: any) {
  try {
    yield put(showScreenLoading('Please wait...'));
    const response = yield call(api.internalLocationDetails, action.payload.id);
    yield put({
      type: GET_INTERNAL_LOCATION_DETAIL_SUCCESS,
      payload: response.data
    });
    yield action.callback(response);
    yield put(hideScreenLoading());
  } catch (e) {
    yield action.callback({
      error: true,
      message: e.message
    });
  }
}
function* getBinLocations() {
  try {
    yield put(showScreenLoading('Please wait..'));
    const response = yield call(api.getBinLocations);
    yield put({
      type: GET_BIN_LOCATIONS_REQUEST_SUCCESS,
      payload: response.data
    });
    yield put(hideScreenLoading());
  } catch (e) {
    Sentry.captureException('Error while get Bin Locations', e.message);
  }
}

function* fetchProductSummary(action: any) {
  try {
    yield put(showScreenLoading('Loading...'));
    const response = yield call(
      api.fetchProductSummary,
      action.payload.location
    );
    yield put({
      type: GET_PRODUCT_SUMMARY_FROM_LOCATION_SUCCESS,
      payload: response.data
    });
    yield action.callback(response.data);
    yield put(hideScreenLoading());
  } catch (e) {
    yield action.callback({
      error: true,
      message: e.message
    });
  }
}

export default function* watcher() {
  yield takeLatest(GET_LOCATIONS_REQUEST, getLocations);
  yield takeLatest(SET_CURRENT_LOCATION_REQUEST, setCurrentLocation);
  yield takeLatest(GET_LOCATION_FROM_NUMBER, searchLocationByLocationNumber);
  yield takeLatest(GET_INTERNAL_LOCATION_FROM_NUMBER, getInternalLocations);
  yield takeLatest(GET_BIN_LOCATIONS_REQUEST, getBinLocations);
  yield takeLatest(GET_PRODUCT_SUMMARY_FROM_LOCATION, fetchProductSummary);
  yield takeLatest(GET_INTERNAL_LOCATION_DETAIL, getInternalLocationsDetails);
  yield takeLatest(
    GET_INTERNAL_LOCATION_DETAIL_REQUEST,
    getInternalLocationDetails
  );
}
