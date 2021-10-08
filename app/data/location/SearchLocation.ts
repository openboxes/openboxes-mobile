import Location from "../order/Location";
import apiClient from "../../utils/ApiClient";
import BinLocation from "../picklist/BinLocation";
import {getHideProgressBarAction} from "../../redux/Dispatchers";

const url = "/locations/"

interface LocationSearchApiResponse {
  location: BinLocation
}

export function searchLocationByLocationNumber(locationNumber: String): Promise<BinLocation>{
  return apiClient.get(url + locationNumber).then((response: LocationSearchApiResponse) => response.data)
    .catch(() => null)
}
