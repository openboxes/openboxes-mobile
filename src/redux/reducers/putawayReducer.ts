import {
    GET_PRODUCT_BY_ID_REQUEST_SUCCESS,
    GET_PRODUCTS_REQUEST_SUCCESS,
    PRINT_LABEL_REQUEST_SUCCESS
} from '../actions/products';
import Location from "../../data/location/Location";
import {Session} from "../../data/auth/Session";
import {FETCH_PUTAWAY_FROM_ORDER_REQUEST_SUCCESS} from "../actions/putaways";

export interface State {
    putAway: any;

}

const initialState: State = {
    putAway: [],
};

function reducer(state = initialState, action: any) {
    switch (action.type) {
        case FETCH_PUTAWAY_FROM_ORDER_REQUEST_SUCCESS: {
            return {
                ...state,
                putAway: [...action.payload.data],
            };
        }

        default: {
            return state;
        }
    }
}

export default reducer;
