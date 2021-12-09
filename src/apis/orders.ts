import apiClient from '../utils/ApiClient';

export function getOrders(value: string | null) {
  console.debug("value::"+value)
  let url = '/stockMovements?exclude=lineItems&direction=OUTBOUND&status=PICKING'
  if (global.location) {
    url += "&origin.id=" + global.location.id
  }
  if(value!=null){
    url += "&identifier="+value
  }
  return apiClient.get(url);
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

export function getStockMovement(direction: string | null, status: string | null) {
  console.debug("direction::"+direction)
  let url = '/stockMovements?direction=' + direction + '&status='+status
  return apiClient.get(url);
}
