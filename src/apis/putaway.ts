import apiClient from '../utils/ApiClient';

export function fetchPutAwayFromOrder(orderNumber: string) {
    return apiClient.get(`/putaways/${orderNumber}`);
}
export function getCandidates(locationId: string) {
    return apiClient.get(`locations/${locationId}/putawayCandidates`);
}

export function createPutawayOder(data: any) {
    return apiClient.post(`/putaways`, data);
}


