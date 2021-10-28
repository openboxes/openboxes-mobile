export const FETCH_PUTAWAY_FROM_ORDER_REQUEST = 'FETCH_PUTAWAY_FROM_ORDER_REQUEST';
export const FETCH_PUTAWAY_FROM_ORDER_REQUEST_SUCCESS = 'FETCH_PUTAWAY_FROM_ORDER_REQUEST_SUCCESS';
export const GET_PUTAWAY_CANDIDATES_REQUEST = 'GET_PUTAWAY_CANDIDATES_REQUEST';
export const GET_PUTAWAY_CANDIDATES_REQUEST_SUCCESS = 'GET_PUTAWAY_CANDIDATES_REQUEST_SUCCESS';
export const CREATE_PUTAWAY_ORDER_REQUEST = 'CREATE_PUTAWAY_ORDER_REQUEST';
export const CREATE_PUTAWAY_ORDER_REQUEST_SUCCESS = 'CREATE_PUTAWAY_ORDER_REQUEST_SUCCESS';


export function fetchPutAwayFromOrderAction(
    orderNumber: string|null,
    callback: (data: any) => void,
) {
  return {
    type: FETCH_PUTAWAY_FROM_ORDER_REQUEST,
    payload: {orderNumber},
    callback,
  };
}
export function getCandidates(
    locationId: string,
    callback?: (data: any) => void,
) {
  return {
    type: GET_PUTAWAY_CANDIDATES_REQUEST,
    payload: {locationId},
    callback,
  };
}

export function createPutawayOderAction(
    data: any,
    callback?: (data: any) => void,
) {
  return {
    type: CREATE_PUTAWAY_ORDER_REQUEST,
    payload: {data},
    callback,
  };
}
