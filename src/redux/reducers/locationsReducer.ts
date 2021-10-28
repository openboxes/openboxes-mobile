import {GET_BIN_LOCATIONS_REQUEST_SUCCESS, SET_CURRENT_LOCATION_REQUEST_SUCCESS} from "../actions/locations";

export interface State {
    locations: any;
    SelectedLocation?: any;
}

const initialState: State = {
    locations: [],
    SelectedLocation: null,
};

function reducer(state = initialState, action: any) {
    switch (action.type) {
        case GET_BIN_LOCATIONS_REQUEST_SUCCESS: {
            return {
                ...state,
                locations: action.payload,
            };
        }
        case SET_CURRENT_LOCATION_REQUEST_SUCCESS: {
            const {location} = action.payload;
            return {
                ...state,
                SelectedLocation: location,
            };
        }

        default: {
            return state;
        }
    }
}

export default reducer;
