import {call, put, takeLatest} from "redux-saga/effects";
import * as api from "../../apis";
import {SAVE_OR_UPDATE_LPN} from "../actions/lpn";
import {GET_LOCATIONS_REQUEST_SUCCESS} from "../actions/locations";

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
        yield action.callback({
            error: true,
            message: e.message,
        });
    }
}

export default function* watcher() {
    yield takeLatest(SAVE_OR_UPDATE_LPN, saveAndUpdateLpn);
}
