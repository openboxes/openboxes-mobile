import apiClient from "../../utils/ApiClient";
import Location from "./Location";

const url = "/locations?locationTypeCode=DEPOT&activityCodes=MANAGE_INVENTORY&applyUserFilter=true"

interface GetLocationsApiResponse {
  data: Location[]
}

export default function getLocations(): Promise<Location[]> {
  return apiClient.get(url)
    .then((response: GetLocationsApiResponse) => response.data)
}
