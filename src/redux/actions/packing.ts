export const GET_SHIPMENT_PACKING_REQUEST = "GET_SHIPMENT_PACKING_REQUEST"
export const GET_SHIPMENT_PACKING_SUCCESS = 'GET_SHIPMENT_PACKING_SUCCESS';
export const GET_SHIPMENT_ORIGIN_REQUEST = "GET_SHIPMENT_ORIGIN_REQUEST"
export const GET_SHIPMENT_ORIGIN_SUCCESS = 'GET_SHIPMENT_ORIGIN_SUCCESS';
export const GET_SHIPMENT_TYPE_REQUEST = "GET_SHIPMENT_TYPE_REQUEST"
export const GET_SHIPMENT_TYPE_SUCCESS = 'GET_SHIPMENT_TYPE_SUCCESS';
;
export const GET_CONTAINER_DETAILS_REQUEST = "GET_CONTAINER_DETAILS_REQUEST"
export const GET_CONTAINER_DETAILS_SUCCESS = 'GET_CONTAINER_DETAILS_SUCCESS';
export const GET_SUBMIT_SHIPMENT_DETAILS_REQUEST = "GET_SUBMIT_SHIPMENT_DETAILS_REQUEST"
export const GET_SUBMIT_SHIPMENT_DETAILS_SUCCESS = "GET_SUBMIT_SHIPMENT_DETAILS_SUCCESS"

export const getShipmentPacking = (id: any, callback: (products: any) => void) => {
    return {
        type: GET_SHIPMENT_PACKING_REQUEST,
        payload: {id},
        callback
    };
}

export const getContainerType = (callback: (products: any) => void, id?: any) => {
    return {
        type: GET_SHIPMENT_TYPE_REQUEST,
        payload: {id},
        callback
    };
}
export const getShipmentOrigin = (id: any, callback: (products: any) => void) => {
    return {
        type: GET_SHIPMENT_ORIGIN_REQUEST,
        payload: {id},
        callback
    };
}
export const getContainerDetails = (id: string) => {
    return {
        type: GET_CONTAINER_DETAILS_REQUEST,
        payload: {id}
    }
}

export const submitShipmentDetails = (id: string, requestBody: any) => {
    return {
        type: GET_SUBMIT_SHIPMENT_DETAILS_REQUEST,
        payload: {id, requestBody}
    }
}