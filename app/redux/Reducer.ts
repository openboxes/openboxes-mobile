import {createReducer} from "@reduxjs/toolkit";
import {
  showFullScreenLoadingIndicatorAction,
  loginAction,
  logoutAction,
  hideFullScreenLoadingIndicatorAction, setCurrentLocationAction, setSessionAction
} from "./Actions";
import {Location} from "../data/location/Models";
import {Session} from "../data/auth/Session";

export interface AppState {
  loggedIn: boolean
  fullScreenLoadingIndicator: {
    visible: boolean
    message?: string | null
  }
  currentLocation?: Location | null
  session?: Session | null
}

const initialState: AppState = {
  loggedIn: false,
  fullScreenLoadingIndicator: {
    visible: false
  },
  currentLocation: null,
  session: null
};

const RootReducer = createReducer<AppState>(initialState, {
  [loginAction.type]: (state, action) => {
    state.loggedIn = true
  },
  [showFullScreenLoadingIndicatorAction.type]: (state, action) => {
    state.fullScreenLoadingIndicator.visible = true
    state.fullScreenLoadingIndicator.message = action.payload
  },
  [hideFullScreenLoadingIndicatorAction.type]: (state, action) => {
    state.fullScreenLoadingIndicator.visible = false
    state.fullScreenLoadingIndicator.message = null
  },
  [logoutAction.type]: (state, action) => {
    state.loggedIn = false
  },
  [setCurrentLocationAction.type]: (state, action) => {
    state.currentLocation = action.payload
  },
  [setSessionAction.type]: (state, action) => {
    const newSession: Session = action.payload
    state.currentLocation = newSession.location
    state.session = newSession
  }
});
export default RootReducer;
