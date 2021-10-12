import PickList from "./PickList";
import apiClient from "../../utils/ApiClient";
import {Item} from "./Item";

const url = "/stockMovements/"


interface GetPickListApiResponse {
  data: Item[]
}

export default function getPickListApi(id: string): Promise<Item[]>{
  const finalUrl = url + id + "/stockMovementItems"
  console.debug("finalUrl"+finalUrl)
  return apiClient.get(finalUrl)
    .then((response: GetPickListApiResponse) => response.data)

}
