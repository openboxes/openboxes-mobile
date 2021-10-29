import apiClient from "../utils/ApiClient";

export function fetchInboundOrderList(id: string = "") {
    return apiClient.get(`/generic/shipment/${id}`);
}


export function fetchPartialReceiving(id: string = "") {
    console.log(id)
    return apiClient.get(`/partialReceiving/${id}`);
}