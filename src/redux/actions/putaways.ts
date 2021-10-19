// import Putaway from "../../../app/data/putaway/Putaway";
// import apiClient from "../../utils/ApiClient";
// import {GET_PICKLIST_REQUEST} from "./orders";
//
// const url = "/putaways"
//
//
// interface PutawayApiResponse{
//   data: Putaway
// }
//
// export function fetchPutawayFromOrder(orderId: string|null):Promise<Putaway>{
//   let getUrl = url + "/" + orderId
//   console.debug("putaway url:"+getUrl)
//   return apiClient.get(getUrl)
//     .then((response: PutawayApiResponse) => response.data)
//
// }


export const FETCH_PUTAWAY_FROM_ORDER_REQUEST = 'FETCH_PUTAWAY_FROM_ORDER_REQUEST';
export const FETCH_PUTAWAY_FROM_ORDER_REQUEST_SUCCESS = 'FETCH_PUTAWAY_FROM_ORDER_REQUEST_SUCCESS';


export function fetchPutAwayFromOrderAction(
    orderId: string|null,
    callback: (data: any) => void,
) {
  console.log('action OK');
  return {
    type: FETCH_PUTAWAY_FROM_ORDER_REQUEST,
    payload: {orderId},
    callback,
  };
}
