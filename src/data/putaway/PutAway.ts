import PutAwayItems from './PutAwayItems';

interface PutAway {
  id: string;
  'origin.id': string;
  'origin.name': string;
  'destination.id': string;
  'destination.name': string;
  putawayNumber: string;
  putawayStatus: string;
  putawayDate: string;
  dateCreated: string;
  sortBy: string;
  putawayItems: PutAwayItems[];
  putawayItem: PutAwayItems; // for putaway list screen needs
}

export interface GetPutAwayApiResponse {
  data: PutAway;
}

export interface GetPutAwaysApiResponse {
  data: PutAway[];
}

export interface PostPutAwayItemApiResponse {
  data: PutAwayItems;
}

export default PutAway;
