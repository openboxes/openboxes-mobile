import apiClient from "../utils/ApiClient";

export function getShipmentPacking(id: string) {
    console.debug("id::><><><:" + id)
    return apiClient.get(`/shipments/${id}`);
}


export const getContainerDetails = (id: string) => {
    return apiClient.get(`/generic/container/${id}`);

}
export const submitShipmentItems = (id: string, body: any) => {
    return apiClient.post(`/shipmentItems/${id}`, body);

}