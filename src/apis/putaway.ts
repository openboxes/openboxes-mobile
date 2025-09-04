import apiClient from '../utils/ApiClient';

export function fetchPutAwayFromOrder(q: string) {
  if (q !== null && q !== '') {
    return apiClient.get(`/mobile/putaways?q=${q}`);
  } else {
    return apiClient.get('/mobile/putaways');
  }
}

export function submitPutawayItem(id: string, requestBody: any) {
  return apiClient.post('/putaways/' + id, requestBody);
}
export function getCandidates(locationId: string) {
  return apiClient.get(`locations/${locationId}/putawayCandidates`);
}

export function createPutawayOder(data: any) {
  return apiClient.post('/putaways', data);
}

export function getPutawayTasks(facilityId: string, productId: string) {
  return apiClient.get(`/facilities/${facilityId}/putaway-tasks?statusCategory=OPEN&product=${productId}`);
}

export function patchPutawayTask(facilityId: string, putawayItemId: string, payload: any) {
  return apiClient.patch(`/facilities/${facilityId}/putaway-tasks/${putawayItemId}`, payload);
}

export function getPutawayDetails(facilityId: string, containerId: string) {
  return apiClient.get(`/facilities/${facilityId}/putaway-tasks?statusCategory=OPEN&container=${containerId}`)
}
