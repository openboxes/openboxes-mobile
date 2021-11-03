import {
    GET_PRODUCT_BY_ID_REQUEST_SUCCESS,
    GET_PRODUCTS_REQUEST_SUCCESS,
    PRINT_LABEL_REQUEST_SUCCESS
} from '../actions/products';
import Location from "../../data/location/Location";
import {Session} from "../../data/auth/Session";
import {FETCH_PUTAWAY_FROM_ORDER_REQUEST_SUCCESS, GET_PUTAWAY_CANDIDATES_REQUEST_SUCCESS, SUBMIT_PUTAWAY_ITEM_BIN_LOCATION_SUCCESS} from "../actions/putaways";

export interface State {
    putAway: any;
    putAwayItem: any;
    candidates: any

}

const initialState: State = {
    putAway: null,
    putAwayItem: null,
    candidates: []
};

function reducer(state = initialState, action: any) {
    switch (action.type) {
        case FETCH_PUTAWAY_FROM_ORDER_REQUEST_SUCCESS: {
            return {
                ...state,
                putAway: action.payload.data,
            };
        }
        case GET_PUTAWAY_CANDIDATES_REQUEST_SUCCESS: {
            return {
                ...state,
                candidates: action.payload,
            };
        }
        case SUBMIT_PUTAWAY_ITEM_BIN_LOCATION_SUCCESS: {
            return {
                ...state,
                putAwayItem: action.payload,
            };
        }

        default: {
            return state;
        }
    }
}


export default reducer;
