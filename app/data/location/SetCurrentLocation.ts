import Location from "./Location";
import apiClient from "../../utils/ApiClient";
import {AppDispatch} from "../../redux/Store";
import {setCurrentLocationAction} from "../../redux/Actions";
import {
  getHideProgressBarAction,
  getShowProgressBarAction
} from "../../redux/Dispatchers";

export default function setCurrentLocation(location: Location) {
  return (dispatch: AppDispatch) => {
    dispatch(getShowProgressBarAction("Setting current location"))
    const url = `/chooseLocation/${location.id}`
    return apiClient.put(url)
      .then(() => {
        dispatch(getHideProgressBarAction())
        dispatch({
          type: setCurrentLocationAction.type,
          payload: location
        })
      })
      .catch(() => dispatch(getHideProgressBarAction()))
  }
}
