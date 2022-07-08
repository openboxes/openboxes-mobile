import apiClient from '../utils/ApiClient';

export function getShipmentsReadyToBePacked(locationId: string, shipmentStatusCode: string) {
  return apiClient.get(
    '/shipments?origin.id=' + locationId + '&shipmentStatusCode=' + shipmentStatusCode + '&requisitionStatus=PICKED'
  );
}

export function getShipment(id: string) {
  return apiClient.get(`/shipments/${id}`);
}

export function getShipmentOrigin(id: string) {
  return apiClient.get(`/shipments/?origin.id=${id}`);
}
export const getContainerDetails = (id: string) => {
  return apiClient.get(`/generic/container/${id}`);
};

export const getContainerType = () => {
  return apiClient.get('generic/containerType');
};

export const submitShipmentItems = (id: string, requestBody: any) => {
  return apiClient.post(`/shipmentItems/${id}`, requestBody);
};
