import Location from '../../data/location/Location';
import {Session} from '../../data/auth/Session';
import {
    SHOW_SCREEN_LOADING,
    HIDE_SCREEN_LOADING,
    GET_SESSION_REQUEST_SUCCESS, REFRESH_SCREEN,
} from '../actions/main';
import {SET_CURRENT_LOCATION_REQUEST_SUCCESS} from '../actions/locations';
import {LOGIN_REQUEST_SUCCESS} from '../actions/auth';
import {GET_PUTAWAY_CANDIDATES_REQUEST_SUCCESS} from "../actions/putaways";
import {GET_PRODUCT_BY_ID_REQUEST_SUCCESS, GET_PRODUCTS_REQUEST_SUCCESS} from "../actions/products";

export interface State {
    loggedIn: boolean;
    fullScreenLoadingIndicator: {
        visible: boolean;
        message?: string | null;
    };
    currentLocation?: Location | null;
    session?: Session | null;
    refreshing: boolean;
}

const initialState: State = {
    loggedIn: false,
    fullScreenLoadingIndicator: {
        visible: false,
        message: null,
    },
    currentLocation: null,
    session: null,
    refreshing: false
};

function reducer(state = initialState, action: any) {
    switch (action.type) {
        case REFRESH_SCREEN: {
            return {
                ...state,
                refreshing: true,
            };
        }
        case GET_SESSION_REQUEST_SUCCESS: {
            const {location} = action.payload;
            return {
                ...state,
                session: action.payload,
                currentLocation: location,
            };
        }
        case LOGIN_REQUEST_SUCCESS: {
            return {
                ...state,
                loggedIn: true,
            };
        }
        case SHOW_SCREEN_LOADING: {
            const {message} = action.payload;
            return {
                ...state,
                fullScreenLoadingIndicator: {
                    visible: true,
                    message,
                },
            };
        }
        case HIDE_SCREEN_LOADING: {
            return {
                ...state,
                fullScreenLoadingIndicator: {
                    visible: false,
                    message: null,
                },
            };
        }
        case SET_CURRENT_LOCATION_REQUEST_SUCCESS: {
            return {
                ...state,
                currentLocation: action.payload,
            };
        }
        case GET_PUTAWAY_CANDIDATES_REQUEST_SUCCESS:
        case GET_PRODUCT_BY_ID_REQUEST_SUCCESS:
        case GET_PRODUCTS_REQUEST_SUCCESS: {
            return {
                ...state,
                refreshing: false,
            };
        }

        default: {
            return state;
        }
    }
}

export default reducer;
