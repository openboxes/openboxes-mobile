import PickList from "./PickList";
import apiClient from "../../utils/ApiClient";
import Item from "./Item";
import PicklistItem from "./PicklistItem";

const url = "/picklists/"
const pickListItemUrl = "/picklistItems/"


interface GetPickListsApiResponse {
  data: PicklistItem[]
}

interface GetPickListApiResponse {
  data: PicklistItem
}

export function getPickListItemsApi(id: string): Promise<PicklistItem[]>{
  const finalUrl = url + id
  console.debug("finalUrl"+finalUrl)
  return apiClient.get(finalUrl)
    .then((response: GetPickListsApiResponse) => response.data.picklistItems)
}

export function getPickListItemApi(id: string): Promise<PicklistItem>{
  const finalUrl = pickListItemUrl + id
  console.debug("finalUrl"+finalUrl)
  return apiClient.get(finalUrl)
    .then((response: GetPickListApiResponse) => response.data)
}
