import {takeLatest, put, call} from 'redux-saga/effects';
import {
    GET_CONTAINER_DETAILS_REQUEST, GET_CONTAINER_DETAILS_SUCCESS,
    GET_SHIPMENT_PACKING_REQUEST,
    GET_SHIPMENT_PACKING_SUCCESS, GET_SHIPMENT_READY_TO_BE_PACKED, GET_SHIPMENTS_READY_TO_BE_PACKED,
    GET_SUBMIT_SHIPMENT_DETAILS_REQUEST, GET_SUBMIT_SHIPMENT_DETAILS_SUCCESS
} from '../actions/packing';
import {
    hideScreenLoading,
    showScreenLoading,
} from '../actions/main';
import * as api from '../../apis';
import ShipmentsReadyToPackedResponse, {ShipmentReadyToPackedResponse} from "../../data/container/Shipment";

function* getShipmentsReadyToBePacked(action: any) {
    try {
        yield showScreenLoading(" Shipment Packing");
        const response: ShipmentsReadyToPackedResponse = yield call(api.getShipmentsReadyToBePacked, action.payload.locationId, action.payload.shipmentStatusCode);
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

function* getShipmentReadyToBePacked(action: any) {
    try {
        yield showScreenLoading(" Shipment Packing details");
        const response: ShipmentReadyToPackedResponse = yield call(api.getShipmentReadyToBePacked, action.payload.id);
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
    yield takeLatest(GET_SHIPMENTS_READY_TO_BE_PACKED, getShipmentsReadyToBePacked);
    yield takeLatest(GET_SHIPMENT_READY_TO_BE_PACKED, getShipmentReadyToBePacked);
    yield takeLatest(GET_SHIPMENT_PACKING_REQUEST, getShipmentPacking);
    yield takeLatest(GET_CONTAINER_DETAILS_REQUEST, getContainerDetail);
    yield takeLatest(GET_SUBMIT_SHIPMENT_DETAILS_REQUEST, submitShipmentItems);


}
