import {takeLatest, put, call} from 'redux-saga/effects';
import {
    FETCH_STOCK_MOVEMENTS,
    FETCH_STOCK_MOVEMENTS_SUCCESS,
    UPDATE_INTERNAL_STOCK_TRANSFER,
    UPDATE_INTERNAL_STOCK_TRANSFER_SUCCESS
} from "../actions/transfers";
import {hideScreenLoading, showScreenLoading} from '../actions/main';
import * as api from '../../apis';
import * as NavigationService from "../../NavigationService";


function* updateStockTransfer(action: any) {
    try {
        yield put(showScreenLoading('updateStockTransfer'));
        const response: any = yield call(api.updateStockTransfers, action.payload.data);
        console.log("Response",response)
        yield put({
            type: UPDATE_INTERNAL_STOCK_TRANSFER_SUCCESS,
            payload: response,
        });
        yield NavigationService.navigate('Drawer');
        yield put(hideScreenLoading());
    } catch (e) {
        console.log('function* updateStockTransfer', e.message);
        console.log( e.response);
        yield put(hideScreenLoading());
    }
}

function* getStockMovements(action: any) {
    try {
        yield put(showScreenLoading('Get Stock Movements'));
        const response: any = yield call(api.getStockMovements, action.payload.id);
        yield put({
            type: FETCH_STOCK_MOVEMENTS_SUCCESS,
            payload: response.data,
        });
        yield action.callback(response.data);
        yield put(hideScreenLoading());
    } catch (e) {
        console.log('function* getStockMovements', e.message);
        console.log( e.response);
        yield put(hideScreenLoading());
    }
}



export default function* watcher() {
    yield takeLatest(UPDATE_INTERNAL_STOCK_TRANSFER, updateStockTransfer);
    yield takeLatest(FETCH_STOCK_MOVEMENTS, getStockMovements);
}
