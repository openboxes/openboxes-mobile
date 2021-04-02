import {Location} from "./Models";
import apiClient from "../../utils/ApiClient";
import {hideProgressBar, showProgressBar} from "../../redux/Dispatchers";
import store, {AppDispatch} from "../../redux/Store";
import {setCurrentLocationAction} from "../../redux/Actions";

export default function setCurrentLocation(location: Location) {
  return (dispatch: AppDispatch) => {
    const url = `/chooseLocation/${location.id}`
    showProgressBar()
    return apiClient.put(url)
      .then(() => {
        dispatch({
          type: setCurrentLocationAction.type,
          payload: location
        })
      })
      .finally(() => hideProgressBar());
  }
}
