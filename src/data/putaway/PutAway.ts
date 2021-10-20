import PutAwayItems from "./PutAwayItems";
import {Order} from "../order/Order";

export default interface PutAway{

  id: string
  // origin: Location
  // destination: Location
  "origin.id": string
  "origin.name": string
  "destination.id": string
  "destination.name": string
  putawayNumber: string
  putawayStatus: string
  // putawayAssignee: string
  putawayDate: string
  dateCreated: string
  // orderedBy: string
  sortBy: string
  putawayItems: PutAwayItems[]

}


export interface GetPutAwayApiResponse {
  data: PutAway;
}
