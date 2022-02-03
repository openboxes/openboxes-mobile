import {GET_BIN_LOCATIONS_REQUEST_SUCCESS, SET_CURRENT_LOCATION_REQUEST_SUCCESS} from "../actions/locations";

export interface State {
    binLocations: any;
}

const initialState: State = {
    binLocations: [],
};

function reducer(state = initialState, action: any) {
    switch (action.type) {
        case GET_BIN_LOCATIONS_REQUEST_SUCCESS: {
            return {
                ...state,
                binLocations: action.payload,
            };
        }
        default: {
            return state;
        }
    }
}

export default reducer;
