import apiClient from '../utils/ApiClient';

export function saveAndUpdateLpn(requestBody: any){
    console.debug("Saving and update Plan")
    console.debug(requestBody)
    return apiClient.post(`/generic/container/`, requestBody);
}

export function fetchContainer(id: string){
    console.debug("fetchContainer id "+id)
    return apiClient.get(`/generic/container/`+id);
}
export function getContainerDetail(id: string){
    return apiClient.get(`/containers/${id}/details`);
}