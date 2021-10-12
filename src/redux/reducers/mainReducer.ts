import Location from '../../data/location/Location';
import {Session} from '../../data/auth/Session';
import {
  SHOW_SCREEN_LOADING,
  HIDE_SCREEN_LOADING,
  GET_SESSION_REQUEST_SUCCESS,
} from '../actions/main';
import {SET_CURRENT_LOCATION_REQUEST_SUCCESS} from '../actions/locations';
import {LOGIN_REQUEST_SUCCESS} from '../actions/auth';

export interface AppState {
  loggedIn: boolean;
  fullScreenLoadingIndicator: {
    visible: boolean;
    message?: string | null;
  };
  currentLocation?: Location | null;
  session?: Session | null;
}

const initialState: AppState = {
  loggedIn: false,
  fullScreenLoadingIndicator: {
    visible: false,
    message: null,
  },
  currentLocation: null,
  session: null,
};

function reducer(state = initialState, action: any) {
  switch (action.type) {
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

    default: {
      return state;
    }
  }
}

export default reducer;
