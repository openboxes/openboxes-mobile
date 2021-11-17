import {call, put, takeLatest} from "redux-saga/effects";
import * as api from "../../apis";
import {
    FETCH_CONTAINER_DETAIL,
    FETCH_CONTAINER_DETAIL_RESPONSE_SUCCESS,
    GET_CONTAINER_DETAIL, GET_CONTAINER_DETAIL_RESPONSE_SUCCESS,
    SAVE_OR_UPDATE_LPN
} from "../actions/lpn";
import {GET_LOCATIONS_REQUEST_SUCCESS} from "../actions/locations";
import {ContainerResponse} from "../../data/container/Container";
import showPopup from "../../components/Popup";
import {handleError} from "./error";
import {getContainerDetails} from "../../apis";

function* saveAndUpdateLpn(action: any) {
    try {
        console.log("sagas saveAndUpdateLpn")
        const response: any = yield call(
            api.saveAndUpdateLpn,
            action.payload.requestBody,
        );

        yield action.callback(response.data);
    } catch (e) {
        console.log('function* saveAndUpdateLpn', e.message);
        handleError(e)
    }
}

function* fetchContainer(action: any) {
    try {
        console.log("sagas fetchContainer:" + action.payload.id)
        const response = yield call(
            api.fetchContainer,
            action.payload.id,
        );
        console.log(response)
        yield put({
            type: FETCH_CONTAINER_DETAIL_RESPONSE_SUCCESS,
            payload: response.data,
        });
        yield action.callback(response.data);
    } catch (e) {
        console.log('function* fetchContainer', e.message);
        yield action.callback({
            error: true,
            message: e.message,
        });
    }
}

function* getContainerDetail(action: any) {
    try {
        console.log("sagas getContainer:" + action.payload.id)
        const response = yield call(
            api.getContainerDetail,
            action.payload.id,
        );
        console.log(response)
        yield put({
            type: GET_CONTAINER_DETAIL_RESPONSE_SUCCESS,
            payload: response.data,
        });
        yield action.callback(response.data);
    } catch (e) {
        console.log('function* getContainer', e.message);
        yield action.callback({
            error: true,
            message: e.message,
        });
    }
}
export default function* watcher() {
    yield takeLatest(SAVE_OR_UPDATE_LPN, saveAndUpdateLpn);
    yield takeLatest(FETCH_CONTAINER_DETAIL, fetchContainer);
    yield takeLatest(GET_CONTAINER_DETAIL, getContainerDetail);
}
