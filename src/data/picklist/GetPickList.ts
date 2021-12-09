import apiClient from "../../utils/ApiClient";
<<<<<<< HEAD:app/data/picklist/GetPickList.ts
import Item from "./Item";
import PicklistItem from "./PicklistItem";
=======
import {Item} from "./Item";
>>>>>>> 066318bb09b5e7fa073028447bd7df3b1737ed16:src/data/picklist/GetPickList.ts

const url = "/picklists/"
const pickListItemUrl = "/picklistItems/"


interface GetPickListsApiResponse {
  data: PicklistItem[]
}

interface GetPickListApiResponse {
  data: PicklistItem
}

<<<<<<< HEAD:app/data/picklist/GetPickList.ts
export function getPickListItemsApi(id: string): Promise<PicklistItem[]>{
  const finalUrl = url + id
  console.debug("finalUrl"+finalUrl)
=======
export default function getPickListApi(id: string): Promise<Item[]> {
  const finalUrl = url + id + "/stockMovementItems"
>>>>>>> 066318bb09b5e7fa073028447bd7df3b1737ed16:src/data/picklist/GetPickList.ts
  return apiClient.get(finalUrl)
    .then((response: GetPickListsApiResponse) => response.data.picklistItems)
}

export function getPickListItemApi(id: string): Promise<PicklistItem>{
  const finalUrl = pickListItemUrl + id
  console.debug("finalUrl"+finalUrl)
  return apiClient.get(finalUrl)
    .then((response: GetPickListApiResponse) => response.data)
}
