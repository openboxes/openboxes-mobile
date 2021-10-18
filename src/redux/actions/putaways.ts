import Putaway from "../../../app/data/putaway/Putaway";
import apiClient from "../../utils/ApiClient";

const url = "/putaways"


interface PutawayApiResponse{
  data: Putaway
}

export function fetchPutawayFromOrder(orderId: string|null):Promise<Putaway>{
  let getUrl = url + "/" + orderId
  // let getUrl = url + "/" + "ff8081817b8871ec017b88d515ee000b"
  console.debug("putaway url:"+getUrl)
  return apiClient.get(getUrl)
    .then((response: PutawayApiResponse) => response.data)

}
