import apiClient from '../utils/ApiClient';

export function saveAndUpdateLpn(requestBody: any) {
  return apiClient.post('/generic/container/', requestBody);
}

export function fetchContainer(id: string) {
    return apiClient.get('/generic/container/' + id);
}

export function getContainerDetail(id: string) {
  return apiClient.get(`/containers/${id}/details`);
}

export function getStatusDetails(id: string,status:any) {
    return apiClient.post(`/containers/${id}`,{status});
}

