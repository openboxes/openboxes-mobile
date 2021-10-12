import {AppDispatch} from "../../redux/Store";
import apiClient from "../../utils/ApiClient";
import {loginAction} from "../../redux/Actions";
import {
  getHideProgressBarAction,
  getShowProgressBarAction
} from "../../redux/Dispatchers";

const url = "/auth"

export function login(username: string, password: string) {
  return (dispatch: AppDispatch) => {
    dispatch(getShowProgressBarAction("Logging in"))
    const requestBody = {
      username: username,
      password: password
    }
    apiClient.post(url, requestBody)
      .then(() => {
        dispatch(getHideProgressBarAction())
        dispatch({
          type: loginAction.type
        });
      })
      .catch(() => dispatch(getHideProgressBarAction()))
  }
}
