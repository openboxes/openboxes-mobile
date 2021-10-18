import apiClient from '../utils/ApiClient';

export function getOrders(value: string | null) {
  console.debug("value::"+value)
  let url = '/stockMovements?exclude=lineItems&direction=OUTBOUND'
  if(value!=null){
    url += "&orderNumber="+value
  }
  return apiClient.get(url);
}

export function getPickList(id: string) {
  return apiClient.get(`/stockMovements/${id}/stockMovementItems`);
}
