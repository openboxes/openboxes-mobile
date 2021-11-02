export const GET_SHIPMENT_PACKING_REQUEST = "GET_SHIPMENT_PACKING_REQUEST"
export const GET_SHIPMENT_PACKING_SUCCESS = 'GET_SHIPMENT_PACKING_SUCCESS';

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