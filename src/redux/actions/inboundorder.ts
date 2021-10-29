export const FETCH_INBOUND_ORDER_LIST_SUCCESS = "FETCH_INBOUND_ORDER_LIST_SUCCESS"
export const FETCH_INBOUND_ORDER_LIST_REQUEST = "FETCH_INBOUND_ORDER_LIST_REQUEST"

export const FETCH_PARTIAL_RECEIVING_REQUEST = "FETCH_PARTIAL_RECEIVING_REQUEST"
export const FETCH_PARTIAL_RECEIVING_SUCCESS = "FETCH_PARTIAL_RECEIVING_SUCCESS"

export function fetchInboundOrderList(callback: (data: any) => void, id?: any) {
    return {
        type: FETCH_INBOUND_ORDER_LIST_REQUEST,
        payload: {id},
        callback
    };
}

export function fetchPartialReceiving(callback: (data: any) => void, id?: any) {
    return {
        type: FETCH_PARTIAL_RECEIVING_REQUEST,
        payload: {id},
        callback
    };
}