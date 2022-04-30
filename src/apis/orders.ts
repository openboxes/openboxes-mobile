import apiClient from '../utils/ApiClient';

export function getOrders(value: string | null) {
  let url = '/stockMovements?exclude=lineItems&direction=OUTBOUND&status=PICKING&sort=expectedShippingDate&order=asc'
  if (global.location) {
    url += "&origin.id=" + global.location.id
  }
  if(value!=null){
    url += "&identifier="+value
  }
  return apiClient.get(url);
}

export function getPickList(id: string) {
  return apiClient.get(`/picklists/${id}`);
}

export function getPickListItem(id: string) {
  return apiClient.get(`/picklistItems/${id}`);
}
  export function submitPickListItem(id: string, requestBody: any) {
  return apiClient.post(`/picklistItems/${id}`, requestBody);
}

export function getStockMovement(direction: string | null, status: string | null) {
  let url = '/stockMovements?direction=' + direction + '&status=' + status;
  return apiClient.get(url);
}
