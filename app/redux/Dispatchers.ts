import {
  hideFullScreenLoadingIndicatorAction,
  logoutAction,
  showFullScreenLoadingIndicatorAction
} from "./Actions";
import store, {AppDispatch} from "./Store";
import showPopup from "../components/Popup";

export function showProgressBar(message?: string | null) {
  return (dispatch: AppDispatch) => {
    dispatch({
      type: showFullScreenLoadingIndicatorAction.type,
      payload: message
    })
  }
}

export function hideProgressBar() {
  return (dispatch: AppDispatch) => {
    dispatch({
      type: hideFullScreenLoadingIndicatorAction.type
    });
  }
}

export async function logout(reason?: string) {
  store.dispatch({
    type: logoutAction.type
  })
  if (reason) await showPopup({message: reason});
}
