import {hideScreenLoading, showScreenLoading} from '../actions/main';
import {call, put, takeLatest} from 'redux-saga/effects';
import * as api from '../../apis';
import {
  GET_LOCATIONS_REQUEST,
  GET_LOCATIONS_REQUEST_SUCCESS,
  SET_CURRENT_LOCATION_REQUEST,
  SET_CURRENT_LOCATION_REQUEST_SUCCESS,
 GET_INTERNAL_LOCATION_FROM_NUMBER, GET_INTERNAL_LOCATIONS_SUCCESS,
  GET_LOCATION_FROM_NUMBER, GET_BIN_LOCATIONS_REQUEST, GET_BIN_LOCATIONS_REQUEST_SUCCESS
} from '../actions/locations';

function* getLocations(action: any) {
  try {
    yield showScreenLoading('Fetching locations');
    const response = yield call(api.getLocations);
    yield put({
      type: GET_LOCATIONS_REQUEST_SUCCESS,
      payload: response.data,
    });
    yield action.callback(response.data);
    yield hideScreenLoading();
  } catch (e) {
    console.log('function* getLocations', e);
    yield action.callback({
      error: true,
      message: e.message,
    });
  }
}

function* setCurrentLocation(action: any) {
  try {
    yield showScreenLoading('Setting current location');
    const response = yield call(
      api.setCurrentLocation,
      action.payload.location,
    );
    yield put({
      type: SET_CURRENT_LOCATION_REQUEST_SUCCESS,
      payload: action.payload,
    });
    yield action.callback(action.payload.location);
    yield hideScreenLoading();
  } catch (e) {
    yield hideScreenLoading();
    yield action.callback({
      error: true,
      message: e.message,
    });
  }
}

function* searchLocationByLocationNumber(action: any) {
  try {
    yield showScreenLoading('Fetching locations with locationNumber:'+action.payload.locationNumber);
    const response = yield call(api.searchLocationByLocationNumber, action.payload.locationNumber);
    yield put({
      type: GET_LOCATIONS_REQUEST_SUCCESS,
      payload: response.data,
    });
    yield action.callback(response.data);
    yield hideScreenLoading();
  } catch (e) {
    console.log('function* getLocations', e);
    yield action.callback({
      error: true,
      message: e.message,
    });
  }
}

function* getInternalLocations(action: any) {
  try {
    yield showScreenLoading('Fetching InternalLocations');
    const response = yield call(api.internalLocations,action.payload.location);
    yield put({
      type: GET_INTERNAL_LOCATIONS_SUCCESS,
      payload: response.data,
    });
    yield action.callback(response);
    yield hideScreenLoading();
  } catch (e) {
    console.log('function* getInternalLocations', e);
    yield action.callback({
      error: true,
      message: e.message,
    });
  }
}
function* getBinLocations() {
  try {
    yield showScreenLoading('Getting Bin locations');
    const response = yield call(api.getBinLocations);
    yield put({
      type: GET_BIN_LOCATIONS_REQUEST_SUCCESS,
      payload: response.data,
    });
    yield hideScreenLoading();
  } catch (e) {
    console.log('function* getBinLocations', e);
  }
}


export default function* watcher() {
  yield takeLatest(GET_LOCATIONS_REQUEST, getLocations);
  yield takeLatest(SET_CURRENT_LOCATION_REQUEST, setCurrentLocation);
  yield takeLatest(GET_LOCATION_FROM_NUMBER, searchLocationByLocationNumber);
  yield takeLatest(GET_INTERNAL_LOCATION_FROM_NUMBER,getInternalLocations)
  yield takeLatest(GET_BIN_LOCATIONS_REQUEST, getBinLocations);
}
