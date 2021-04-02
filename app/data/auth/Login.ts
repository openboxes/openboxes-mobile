import {AppDispatch} from "../../redux/Store";
import apiClient from "../../utils/ApiClient";
import {loginAction} from "../../redux/Actions";

const url = "/login"

export function login(username: string, password: string) {
  return (dispatch: AppDispatch) => {
    const requestBody = {
      username: username,
      password: password
    }
    apiClient.post(url, requestBody)
      .then(() => {
        dispatch({
          type: loginAction.type
        });
      })
  }
}
