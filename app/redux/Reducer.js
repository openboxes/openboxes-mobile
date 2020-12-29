import {createReducer} from "@reduxjs/toolkit";

const initialState = {
  user: null,
  progressDialog: {
    visible: false
  }
};

const RootReducer = createReducer(initialState, {
  USER_LOGS_IN: (state, action) => {
    state.user = action.payload;
  },
  SHOW_PROGRESS_DIALOG: (state, action) => {
    state.progressDialog.visible = true
  },
  HIDE_PROGRESS_DIALOG: (state, action) => {
    state.progressDialog.visible = false
  }
});
export default RootReducer;
