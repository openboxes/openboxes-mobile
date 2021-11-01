import {takeLatest, put, call} from 'redux-saga/effects';
import {STOCK_TRANSFERS_REQUEST, STOCK_TRANSFERS_REQUEST_SUCCESS} from '../actions/transfers';
import {
    hideScreenLoading,
    showScreenLoading,
} from '../actions/main';
import * as api from '../../apis';

function* stockTransfers(action: any) {
    try {
        yield showScreenLoading("stock transfer process");
        const response = yield call(api.stockTransfers, action.payload);
        yield put({
            type: STOCK_TRANSFERS_REQUEST_SUCCESS,
            payload: response.data,
        });
        yield hideScreenLoading();
    } catch (e) {
        console.log('function* stockTransfers', e.response);
    }
}


export default function* watcher() {
    yield takeLatest(STOCK_TRANSFERS_REQUEST, stockTransfers);
}
