import apiClient from '../utils/ApiClient';

export function getOutboundOrders() {
  let url =
    '/stockMovements?exclude=lineItems&direction=OUTBOUND&requisitionStatusCode=VERIFYING' +
    '&sort=dateCreated&order=asc&deliveryTypeCode=PICK_UP';
  if (global.location) {
    url += '&origin=' + global.location.id;
  }

  return apiClient.get(url);
}

export function getOutboundOrderDetails(id: string) {
  return apiClient.get(`/outbound-orders/${id}`);
}

export function allocate(orderId: string, lineItemId: string, payload: any) {
  return apiClient.post(`/outbound-orders/${orderId}/items/${lineItemId}/allocations`, payload);
}

export function updateOrderStatus(orderId: string, status: string) {
  return apiClient.post(`/stockMovements/${orderId}/status`, { status });
}
