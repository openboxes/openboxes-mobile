import {AppDispatch} from "../../redux/Store";
import apiClient, {ApiError} from "../../utils/ApiClient";
import {loginAction} from "../../redux/Actions";
import showPopup from "../../components/Popup";
import {hideProgressBar, showProgressBar} from "../../redux/Dispatchers";

const url = "/login"

export function login(username: string, password: string) {
  return (dispatch: AppDispatch) => {
    const requestBody = {
      username: username,
      password: password
    }
    showProgressBar("Logging in")
    apiClient.post(url, requestBody)
      .then(() => {
        dispatch({
          type: loginAction.type
        });
      })
      .catch(async (e: ApiError) => {
        await showPopup({message : e.message});
      })
      .finally(() => hideProgressBar());
  }
}
