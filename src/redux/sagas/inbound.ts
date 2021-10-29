import {takeLatest, put, call} from 'redux-saga/effects';
import {FETCH_INBOUND_ORDER_LIST_SUCCESS, FETCH_INBOUND_ORDER_LIST_REQUEST} from "../actions/inboundorder";
import {hideScreenLoading, showScreenLoading} from '../actions/main';
import * as api from '../../apis';


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


export default function* watcher() {
    yield takeLatest(FETCH_INBOUND_ORDER_LIST_REQUEST, fetchInboundOrderList);
}
