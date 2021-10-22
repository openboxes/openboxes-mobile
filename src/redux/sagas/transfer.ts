import {takeLatest, put, call} from 'redux-saga/effects';
import {UPDATE_INTERNAL_STOCK_TRANSFER} from "../actions/transfers";
import {hideScreenLoading, showScreenLoading} from '../actions/main';
import * as api from '../../apis';
import {StockTransferApiResponse} from "../../data/transfer/Transfer";


function* updateStockTransfer(action: any) {
    try {
        yield showScreenLoading('updateStockTransfer');
        const response: any = yield call(api.updateStockTransfer, action.payload);
        console.log("Response",response)
        yield put({
            type: UPDATE_INTERNAL_STOCK_TRANSFER,
            payload: response.data,
        });
        yield action.callback(response.data);
        yield hideScreenLoading();
    } catch (e) {
        console.log('function* updateStockTransfer', e.message);
        console.log( e.response);
        yield action.callback({
            error: true,
            message: e.message,
        });
    }
}



export default function* watcher() {
    yield takeLatest(UPDATE_INTERNAL_STOCK_TRANSFER, updateStockTransfer);
}
