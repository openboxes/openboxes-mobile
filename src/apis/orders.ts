import apiClient from '../utils/ApiClient';

export function getOrders() {
  return apiClient.get('/stockMovements?exclude=lineItems&direction=OUTBOUND');
}

export function getPickList(id: string) {
  return apiClient.get(`/stockMovements/${id}/stockMovementItems`);
}
