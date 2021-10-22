import {takeLatest, put, call} from 'redux-saga/effects';
import {UPDATE_INTERNAL_STOCK_TRANSFER,UPDATE_INTERNAL_STOCK_TRANSFER_SUCCESS} from "../actions/transfers";
import {hideScreenLoading, showScreenLoading} from '../actions/main';
import * as api from '../../apis';


function* updateStockTransfer(action: any) {
    try {
        yield put(showScreenLoading('updateStockTransfer'));
        const response: any = yield call(api.updateStockTransfers, action.payload.data);
        console.log("Response",response)
        yield put({
            type: UPDATE_INTERNAL_STOCK_TRANSFER_SUCCESS,
            payload: response,
        });
        yield put(hideScreenLoading());
    } catch (e) {
        console.log('function* updateStockTransfer', e.message);
        console.log( e.response);
        yield put(hideScreenLoading());
    }
}



export default function* watcher() {
    yield takeLatest(UPDATE_INTERNAL_STOCK_TRANSFER, updateStockTransfer);
}
