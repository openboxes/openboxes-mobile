import {Session} from "./Session";
import apiClient from "../../utils/ApiClient";
import {hideProgressBar, showProgressBar} from "../../redux/Dispatchers";
import {AppDispatch} from "../../redux/Store";
import {setSessionAction} from "../../redux/Actions";

const url = '/getAppContext';

interface GetSessionApiResponse {
  data: Session
}

export default function getSession() {
  return (dispatch: AppDispatch) => {
    showProgressBar("Loading session")
    apiClient.get(url)
      .then((response: GetSessionApiResponse) => {
        dispatch({
          type: setSessionAction.type,
          payload: response.data
        })
        return response.data
      })
      .finally(() => hideProgressBar())
  }
}
