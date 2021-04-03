import {
  hideFullScreenLoadingIndicatorAction,
  logoutAction,
  showFullScreenLoadingIndicatorAction
} from "./Actions";
import store, {AppDispatch} from "./Store";
import showPopup from "../components/Popup";

export function dispatchShowProgressBarAction(message?: string | null) {
  return (dispatch: AppDispatch) => {
    dispatch(getShowProgressBarAction(message))
  }
}

export function getShowProgressBarAction(message?: string | null) {
  return {
    type: showFullScreenLoadingIndicatorAction.type,
    payload: message
  }
}

export function dispatchHideProgressBarAction() {
  return (dispatch: AppDispatch) => dispatch(getHideProgressBarAction())
}

export function getHideProgressBarAction() {
  return {
    type: hideFullScreenLoadingIndicatorAction.type
  }
}

export async function logout(reason?: string) {
  store.dispatch({
    type: logoutAction.type
  })
  if (reason) await showPopup({message: reason});
}
