import {takeLatest, put, call} from 'redux-saga/effects';
import {
    GET_CONTAINER_DETAILS_REQUEST, GET_CONTAINER_DETAILS_SUCCESS,
    GET_SHIPMENT_PACKING_REQUEST,
    GET_SHIPMENT_PACKING_SUCCESS,
    GET_SUBMIT_SHIPMENT_DETAILS_REQUEST, GET_SUBMIT_SHIPMENT_DETAILS_SUCCESS
} from '../actions/packing';
import {
    hideScreenLoading,
    showScreenLoading,
} from '../actions/main';
import * as api from '../../apis';

function* getShipmentPacking(action: any) {
    try {
        yield showScreenLoading(" Shipment Packing");
        const response = yield call(api.getShipmentPacking, action.payload.id);
        yield put({
            type: GET_SHIPMENT_PACKING_SUCCESS,
            payload: response.data,
        });
        yield action.callback(response.data);
        console.log(response)
        yield hideScreenLoading();
    } catch (e) {
        console.log('function* getShipmentPacking', e.response);
    }
}

function* getContainerDetail(action: any) {
    try {
        yield showScreenLoading(" Container Details ");
        const response = yield call(api.getContainerDetails, action.payload.id);
        yield put({
            type: GET_CONTAINER_DETAILS_SUCCESS,
            payload: response.data,
        });
        console.log(response)
        yield hideScreenLoading();
    } catch (e) {
        console.log('function* getContainerDetails', e.response);
    }
}


function* submitShipmentItems(action: any) {
    try {
        yield showScreenLoading(" submit Shipment Items Details ");
        const response = yield call(api.submitShipmentItems, action.payload.id, action.payload.body);
        yield put({
            type: GET_SUBMIT_SHIPMENT_DETAILS_SUCCESS,
            payload: response.data,
        });
        console.log(response)
        yield hideScreenLoading();
    } catch (e) {
        console.log('function* submitShipmentItems', e.response);
    }
}


export default function* watcher() {
    yield takeLatest(GET_SHIPMENT_PACKING_REQUEST, getShipmentPacking);
    yield takeLatest(GET_CONTAINER_DETAILS_REQUEST, getShipmentPacking);
    yield takeLatest(GET_SUBMIT_SHIPMENT_DETAILS_REQUEST, submitShipmentItems);


}