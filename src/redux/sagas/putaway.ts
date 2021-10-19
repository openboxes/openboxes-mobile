import {takeLatest, put, call} from 'redux-saga/effects';
import {
    FETCH_PUTAWAY_FROM_ORDER_REQUEST,
    FETCH_PUTAWAY_FROM_ORDER_REQUEST_SUCCESS,
} from '../actions/putaways';
import {hideScreenLoading, showScreenLoading} from '../actions/main';
import * as api from '../../apis';


function* fetchPutAwayFromOrder(action: any) {
    try {
        yield showScreenLoading('Fetching products');
        const response = yield call(api.fetchPutAwayFromOrder, action.payload.orderId);
        yield put({
            type: FETCH_PUTAWAY_FROM_ORDER_REQUEST_SUCCESS,
            payload: response.data,
        });
        yield action.callback(response.data);
        yield hideScreenLoading();
    } catch (e) {
        // console.log('function* fetchPutAwayFromOrder', e.message);
        console.log( e.response);
        yield action.callback({
            error: true,
            message: e.message,
        });
    }
}



export default function* watcher() {
    yield takeLatest(FETCH_PUTAWAY_FROM_ORDER_REQUEST, fetchPutAwayFromOrder);
}
