import apiClient, {ApiError} from "../utils/ApiClient";
import {hideProgressDialogAction, loginAction, logoutAction, showProgressDialogAction} from "./Actions";
import store, {AppDispatch} from "./Store";
import showPopup from "../components/Popup";

export function loginUser(username: string, password: string) {
  return (dispatch: AppDispatch) => {
    const url = "TODO";
    const request = {
      username: username,
      password: password
    };
    showProgressBar();
    apiClient.post(url, request)
      .then(response => {
        /*
        FIXME:
         1. The `response` object will contain data like `userid`, `username` and `authtoken`.
        */
        hideProgressBar()
        dispatch({
          type: loginAction.type,
          payload: response
        });
      })
      .catch((e: ApiError) => {
        hideProgressBar();
        showPopup(e.message);
      });
  };
}

export function showProgressBar() {
  store.dispatch({
    type: showProgressDialogAction.type
  });
}

export function hideProgressBar() {
  store.dispatch({
    type: hideProgressDialogAction.type
  });
}

export function logout(reason?: string) {
  store.dispatch({
    type: logoutAction.type
  })
  if(reason) showPopup(reason);
}
