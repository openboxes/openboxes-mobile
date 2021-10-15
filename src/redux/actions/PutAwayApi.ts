import PutAway from "../../../app/data/putaway/PutAway";
import apiClient from "../../utils/ApiClient";

const url = "/putaways"


interface PutAwayApiResponse{
  data: PutAway
}

export function fetchPutAwayFromOrder(orderId: string|null):Promise<PutAway>{
  let getUrl = url + "/" + orderId
  // let getUrl = url + "/" + "ff8081817b8871ec017b88d515ee000b"
  console.debug("putAway url:"+getUrl)
  return apiClient.get(getUrl)
    .then((response: PutAwayApiResponse) => response.data)

}
