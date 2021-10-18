import PutawayItems from "./PutawayItems";

export default interface Putaway{

  id: string
  putawayNumber: string
  putawayStatus: string
  putawayDate: string
  dateCreated: string
  "origin.id": string
  "origin.name": string
  "destination.id": string
  "destination.name": string
  putawayAssignee: string
  orderedBy: string
  sortBy: string
  putawayItems: PutawayItems[]

}
