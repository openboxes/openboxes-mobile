import apiClient from '../utils/ApiClient';

export function getOrders() {
  return apiClient.get('/stockMovements?exclude=lineItems&direction=OUTBOUND');
}

export function getPickList(id: string) {
  console.debug("id::><><><:"+id)
  return apiClient.get(`/picklists/`+id);
}

export function getPickListItem(id: string) {
  return apiClient.get(`/picklistItems/`+id);
}
export function submitPickListItem(id: string, requestBody: any) {
  console.debug("submit id:"+id)
  console.debug(requestBody)
  return apiClient.post(`/picklistItems/`+id, requestBody);
}
