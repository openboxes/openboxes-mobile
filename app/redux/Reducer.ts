import {createReducer} from "@reduxjs/toolkit";
import {
  showFullScreenLoadingIndicatorAction,
  loginAction,
  logoutAction,
  hideFullScreenLoadingIndicatorAction
} from "./Actions";

export interface AppState {
  /*
  FIXME:
   The `user` object type is yet to be decided since it needs to come from the
   backend. Hence it has been set as any for now.
  */
  user?: any;
  fullScreenLoadingIndicator: {
    visible: boolean;
  };
}

const initialState: AppState = {
  user: null,
  fullScreenLoadingIndicator: {
    visible: false
  }
};

const RootReducer = createReducer<AppState>(initialState, {
  [loginAction.type]: (state, action) => {
    state.user = action.payload;
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
