export const FETCH_INBOUND_ORDER_LIST_SUCCESS = 'FETCH_INBOUND_ORDER_LIST_SUCCESS';
export const FETCH_INBOUND_ORDER_LIST_REQUEST = 'FETCH_INBOUND_ORDER_LIST_REQUEST';

export const FETCH_PARTIAL_RECEIVING_REQUEST = 'FETCH_PARTIAL_RECEIVING_REQUEST';
export const FETCH_PARTIAL_RECEIVING_SUCCESS = 'FETCH_PARTIAL_RECEIVING_SUCCESS';

export const SUBMIT_PARTIAL_RECEIVING_REQUEST = 'SUBMIT_PARTIAL_RECEIVING_REQUEST';
export const SUBMIT_PARTIAL_RECEIVING_SUCCESS = 'SUBMIT_PARTIAL_RECEIVING_SUCCESS';

export const CREATE_RECEIVING_BIN_LOCATION_REQUEST = 'CREATE_RECEIVING_BIN_LOCATION_REQUEST';
export const CREATE_RECEIVING_BIN_LOCATION_SUCCESS = 'CREATE_RECEIVING_BIN_LOCATION_SUCCESS';

export function fetchInboundOrderList(callback: (data: any) => void, id?: any, suppressLoading?: boolean) {
  return {
    type: FETCH_INBOUND_ORDER_LIST_REQUEST,
    payload: { id },
    callback,
    suppressLoading
  };
}

export function fetchPartialReceiving(callback: (data: any) => void, id?: any) {
  return {
    type: FETCH_PARTIAL_RECEIVING_REQUEST,
    payload: { id },
    callback
  };
}

export function submitPartialReceiving(id: any, body: any, callback?: (data: any) => void) {
  return {
    type: SUBMIT_PARTIAL_RECEIVING_REQUEST,
    payload: { id, body },
    callback
  };
}

export function createReceivingBin(id: any, callback?: (data: any) => void) {
  return {
    type: CREATE_RECEIVING_BIN_LOCATION_REQUEST,
    payload: { id },
    callback
  };
}
