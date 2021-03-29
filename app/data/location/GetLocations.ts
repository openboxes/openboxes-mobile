import apiClient, {ApiError} from "../../utils/ApiClient";
import {Location} from "./Models";
import {hideProgressBar, showProgressBar} from "../../redux/Dispatchers";

const url = "/locations?locationTypeCode=DEPOT&activityCodes=MANAGE_INVENTORY&applyUserFilter=true"

interface GetLocationsApiResponse {
  data: Location[]
}

export default function getLocations(): Promise<Location[]> {
  showProgressBar()
  return apiClient.get(url)
    .then((response: GetLocationsApiResponse) => {
      hideProgressBar()
      return response.data
    })
    .finally(() => hideProgressBar())
}
