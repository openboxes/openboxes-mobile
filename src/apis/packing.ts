import apiClient from "../utils/ApiClient";

export function getShipmentsReadyToBePacked(locationId: string, shipmentStatusCode: string) {
    console.debug("locationId::><><><:" + locationId)
    console.debug("shipmentStatusCode::><><><:" + shipmentStatusCode)
    return apiClient.get(`/shipments?origin.id=` + locationId + `&shipmentStatusCode=`+shipmentStatusCode);
}

export function getShipmentReadyToBePacked(id: string) {
    console.debug("shipment details with id::><><><:" + id)
    return apiClient.get(`/shipments/`+id);
}

export function getShipmentPacking(id: string) {
    console.debug("id::><><><:" + id)
    return apiClient.get(`/shipments/${id}`);
}

export function getShipmentOrigin(id: string) {
    console.debug("id::><><><:" + id)
    return apiClient.get(`/shipments/?origin.id=${id}`);
}
export const getContainerDetails = (id: string) => {
    return apiClient.get(`/generic/container/${id}`);
}

export const getContainerType = () => {
    return apiClient.get(`generic/containerType`);

}

export const submitShipmentItems = (id: string, requestBody: any) => {
    return apiClient.post(`/shipmentItems/${id}`, requestBody);
}
