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
export const SUBMIT_PUTAWAY_ITEM_BIN_LOCATION = 'SUBMIT_PUTAWAY_ITEM_BIN_LOCATION';
export const SUBMIT_PUTAWAY_ITEM_BIN_LOCATION_SUCCESS = 'SUBMIT_PUTAWAY_ITEM_BIN_LOCATION_SUCCESS';


export function fetchPutAwayFromOrderAction(
    q: string|null,
    callback: (data: any) => void,
) {
  console.log('action OK');
  return {
    type: FETCH_PUTAWAY_FROM_ORDER_REQUEST,
    payload: {q},
    callback,
  };
}

export  function submitPutawayItem(
    id: string,
    requestBody: any,
    callback: (data: any) => void,

){
return{
  type: SUBMIT_PUTAWAY_ITEM_BIN_LOCATION,
  payload: {id, requestBody},
  callback,
}
}
