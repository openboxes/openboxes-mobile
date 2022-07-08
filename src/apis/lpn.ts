import apiClient from '../utils/ApiClient';

export function saveAndUpdateLpn(requestBody: any) {
  return apiClient.post('/containers/', requestBody);
}

export function fetchContainer(id: string) {
  return apiClient.get('/generic/container/' + id);
}

export function getContainerDetail(id: string) {
  return apiClient.get(`/containers/${id}/details`);
}

export function updateContainerStatus(id: string, requestBody: any) {
  return apiClient.post(`/containers/${id}/status`, requestBody);
}
