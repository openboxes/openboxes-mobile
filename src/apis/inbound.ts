import apiClient from "../utils/ApiClient";

export function fetchInboundOrderList(id: string = "") {
    return apiClient.get(`/generic/shipment/${id}`);
}
