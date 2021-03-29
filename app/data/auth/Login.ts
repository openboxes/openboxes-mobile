import store, {AppDispatch} from "../../redux/Store";
import apiClient, {ApiError} from "../../utils/ApiClient";
import {loginAction} from "../../redux/Actions";
import showPopup from "../../components/Popup";
import {hideProgressBar, showProgressBar} from "../../redux/Dispatchers";

const url = "/login"

export function login(username: string, password: string) {
  const requestBody = {
    username: username,
    password: password
  };
  showProgressBar();
  apiClient.post(url, requestBody)
    .then(() => {
      hideProgressBar()
      store.dispatch({
        type: loginAction.type,
        payload: {
          username: username
        }
      });
    })
    .catch(async (e: ApiError) => {
      hideProgressBar();
      await showPopup({message : e.message});
    });
}
