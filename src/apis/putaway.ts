import apiClient from '../utils/ApiClient';

export function fetchPutAwayFromOrder(q: string) {
  if (q !== null && q !== '') {
    return apiClient.get(`/putaways?q=${q}`);
  } else {
    return apiClient.get('/putaways');
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
