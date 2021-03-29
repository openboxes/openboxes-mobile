import {createReducer} from "@reduxjs/toolkit";
import {
  showFullScreenLoadingIndicatorAction,
  loginAction,
  logoutAction,
  hideFullScreenLoadingIndicatorAction
} from "./Actions";
import {User} from "./User";
import {Location} from "../data/location/Models";

export interface AppState {
  user?: User | null
  fullScreenLoadingIndicator: {
    visible: boolean
  }
  currentLocation?: Location | null
}

const initialState: AppState = {
  user: null,
  fullScreenLoadingIndicator: {
    visible: false
  },
  currentLocation: null
};

const RootReducer = createReducer<AppState>(initialState, {
  [loginAction.type]: (state, action) => {
    state.user = {
      username: action.payload.username
    };
  },
  [showFullScreenLoadingIndicatorAction.type]: (state, action) => {
    state.fullScreenLoadingIndicator.visible = true
  },
  [hideFullScreenLoadingIndicatorAction.type]: (state, action) => {
    state.fullScreenLoadingIndicator.visible = false
  },
  [logoutAction.type]: (state, action) => {
    state.user = null;
  }
});
export default RootReducer;
