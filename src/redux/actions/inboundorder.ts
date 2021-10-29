export const FETCH_INBOUND_ORDER_LIST_SUCCESS = "FETCH_INBOUND_ORDER_LIST_SUCCESS"
export const FETCH_INBOUND_ORDER_LIST_REQUEST = "FETCH_INBOUND_ORDER_LIST_REQUEST"


export function fetchInboundOrderList(callback: (data: any) => void,id?: any) {
    return {
        type: FETCH_INBOUND_ORDER_LIST_REQUEST,
        payload: {id},
        callback
    };
}