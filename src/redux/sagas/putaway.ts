import {takeLatest, put, call} from 'redux-saga/effects';
import {
    CREATE_PUTAWAY_ORDER_REQUEST,
    CREATE_PUTAWAY_ORDER_REQUEST_SUCCESS,
    FETCH_PUTAWAY_FROM_ORDER_REQUEST,
    FETCH_PUTAWAY_FROM_ORDER_REQUEST_SUCCESS,
    GET_PUTAWAY_CANDIDATES_REQUEST,
    GET_PUTAWAY_CANDIDATES_REQUEST_SUCCESS,
} from '../actions/putaways';
import {hideScreenLoading, showScreenLoading} from '../actions/main';
import {GetPutAwayApiResponse} from "../../data/putaway/PutAway";
import * as api from '../../apis';


function* fetchPutAwayFromOrder(action: any) {
    try {
        yield showScreenLoading('Fetching products');
        const response: GetPutAwayApiResponse = yield call(api.fetchPutAwayFromOrder, action.payload.orderNumber);
        yield put({
            type: FETCH_PUTAWAY_FROM_ORDER_REQUEST_SUCCESS,
            payload: response.data,
        });
        yield action.callback(response.data);
        yield hideScreenLoading();
    } catch (e) {
        console.log('function* fetchPutAwayFromOrder', e.message);
        yield action.callback({
            error: true,
            message: e.message,
        });
    }
}
function* getCandidates(action: any) {
    try {
        yield showScreenLoading('Get Candidates');
        const response = yield call(api.getCandidates, action.payload.locationId);
        yield put({
            type: GET_PUTAWAY_CANDIDATES_REQUEST_SUCCESS,
            payload: response.data,
        });
        yield hideScreenLoading();
    } catch (e) {
        console.log('function* getCandidates', e.message);
        // yield action.callback({
        //     error: true,
        //     message: e.message,
        // });
    }
}

function* createPutawayOder(action: any){
    try {
        yield showScreenLoading('Get Candidates');
        const response = yield call(api.createPutawayOder, action.payload.data);
        console.log(2222222,response.data)
        yield put({
            type: CREATE_PUTAWAY_ORDER_REQUEST_SUCCESS,
            payload: response.data,
        });
        yield hideScreenLoading()
    }catch (e){
        console.log('function* createPutawayOder', e.message);
    }
}


export default function* watcher() {
    yield takeLatest(FETCH_PUTAWAY_FROM_ORDER_REQUEST, fetchPutAwayFromOrder);
    yield takeLatest(GET_PUTAWAY_CANDIDATES_REQUEST, getCandidates);
    yield takeLatest(CREATE_PUTAWAY_ORDER_REQUEST, createPutawayOder);
}
