import {takeLatest, put, call} from 'redux-saga/effects';
import {
    FETCH_INBOUND_ORDER_LIST_SUCCESS,
    FETCH_INBOUND_ORDER_LIST_REQUEST,
    FETCH_PARTIAL_RECEIVING_SUCCESS,
    FETCH_PARTIAL_RECEIVING_REQUEST,
    SUBMIT_PARTIAL_RECEIVING_REQUEST,
    SUBMIT_PARTIAL_RECEIVING_SUCCESS
} from "../actions/inboundorder";
import {hideScreenLoading, showScreenLoading} from '../actions/main';
import * as api from '../../apis';
import showPopup from "../../components/Popup";


function* fetchInboundOrderList(action: any) {
    try {
        yield put(showScreenLoading('Fetching inbound orders'));
        const response: any = yield call(api.fetchInboundOrderList, action.payload.id ?? "");
        console.log("Response", response)
        yield put({
            type: FETCH_INBOUND_ORDER_LIST_SUCCESS,
            payload: response.data,
        });
        yield action.callback(response.data);
        yield put(hideScreenLoading());
    } catch (e) {
        console.log('function* fetchInboundOrder', e.message);
        console.log(e.response);
        yield put(hideScreenLoading());
    }
}


function* submitPartialReceiving(action: any) {
    try {
        yield put(showScreenLoading('Submit Receive orders'));
        const response: any = yield call(api.submitPartialReceiving, action.payload.id, action.payload.body);
        yield put({
            type: SUBMIT_PARTIAL_RECEIVING_SUCCESS,
            payload: response.data,
        });
        if (action.callback)
            yield action.callback(response);
        yield put(hideScreenLoading());
    } catch (e) {
        console.log('function* submitPartialReceiving', e.message);
        console.log(e.response);
        if (e.response.status == 401) {
            showPopup({message: "Invalid id", positiveButton: "ok"});
        } else if (e.response.status == 500) {
            showPopup({message: "Something went wrong on server", positiveButton: "ok"});
        } else if (e.response.status == 404) {
            showPopup({message: "Server unavailable", positiveButton: "ok"});
        }
        yield put(hideScreenLoading());
    }
}


function* fetchPartialReceiving(action: any) {
    try {
        yield put(showScreenLoading('Fetching Partial Receiving'));
        const response: any = yield call(api.fetchPartialReceiving, action.payload.id ?? "");
        console.log("Response", response)
        yield put({
            type: FETCH_PARTIAL_RECEIVING_SUCCESS,
            payload: response.data,
        });
        yield action.callback(response.data);
        yield put(hideScreenLoading());
    } catch (e) {
        console.log('function* PartialReceiving', e.message);
        console.log(e.response);
        yield put(hideScreenLoading());
    }
}

export default function* watcher() {
    yield takeLatest(FETCH_INBOUND_ORDER_LIST_REQUEST, fetchInboundOrderList)
    yield takeLatest(FETCH_PARTIAL_RECEIVING_REQUEST, fetchPartialReceiving);
    yield takeLatest(SUBMIT_PARTIAL_RECEIVING_REQUEST, submitPartialReceiving);
}
