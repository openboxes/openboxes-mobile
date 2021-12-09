import Person from "./Person";
import Requisition from "./Requisition";
<<<<<<< HEAD:app/data/picklist/PickList.ts
import Item from "./Item";
import Order from "../order/Order";
import apiClient from "../../utils/ApiClient";
import PicklistItem from "./PicklistItem";


const url = "/picklistItems/"
=======
import {Item} from "./Item";
import {PicklistItem} from "./PicklistItem";
>>>>>>> 066318bb09b5e7fa073028447bd7df3b1737ed16:src/data/picklist/PickList.ts

export default interface PickList{
  id: string,
  name: string,
  description: string,
  picker: Person,
  datePicked: Date,
  requisition: Requisition
  picklistItems: PicklistItem[]
<<<<<<< HEAD:app/data/picklist/PickList.ts
}

interface SubmitPickListResponse {
  data: any
}

export function submitPickListItem(requestBody: any, id: string | undefined): Promise<Order[]> {
  const postUrl = url + id
  return apiClient.post(postUrl, requestBody)
    .then((response: SubmitPickListResponse) => response.data)
=======
>>>>>>> 066318bb09b5e7fa073028447bd7df3b1737ed16:src/data/picklist/PickList.ts
}
