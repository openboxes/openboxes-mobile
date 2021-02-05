import {createReducer} from "@reduxjs/toolkit";
import {
  hideProgressDialogAction,
  loginAction,
  logoutAction,
  showProgressDialogAction
} from "./Actions";

export interface AppState {
  /*
  FIXME:
   The `user` object type is yet to be decided since it needs to come from the
   backend. Hence it has been set as any for now.
  */
  user?: any;
  progressDialog: {
    visible: boolean;
  };
}

const initialState: AppState = {
  user: null,
  progressDialog: {
    visible: false
  }
};

const RootReducer = createReducer<AppState>(initialState, {
  [loginAction.type]: (state, action) => {
    state.user = action.payload;
  },
  [showProgressDialogAction.type]: (state, action) => {
    state.progressDialog.visible = true
  },
  [hideProgressDialogAction.type]: (state, action) => {
    state.progressDialog.visible = false
  },
  [logoutAction.type]: (state, action) => {
    state.user = null;
  }
});
export default RootReducer;
