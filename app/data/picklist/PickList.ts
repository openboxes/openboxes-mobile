import Person from "./Person";
import Requisition from "./Requisition";
import Item from "./Item";
import Order from "../order/Order";
import apiClient from "../../utils/ApiClient";


const url = "/picklistItems/"

export default interface PickList{
  id: string,
  name: string,
  description: string,
  picker: Person,
  datePicked: Date,
  requisition: Requisition
  picklistItems: Item[]
}

interface SubmitPickListResponse {
  data: any
}

export function submitPickListItem(requestBody: any, id: string | undefined): Promise<Order[]> {
  const postUrl = url + id
  return apiClient.post(postUrl, requestBody)
    .then((response: SubmitPickListResponse) => response.data)
}
