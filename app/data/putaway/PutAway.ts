import Location from "../location/Location";
import PutawayItems from "./PutawayItems";

export default interface Putaway{

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
  putawayItems: PutawayItems[]

}
