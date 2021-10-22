import apiClient from '../utils/ApiClient';

export function fetchPutAwayFromOrder(orderNumber: string) {
    return apiClient.get(`/putaways/${orderNumber}`);
}


export function submitPutawayItem(id: string, requestBody: any) {
    console.debug(requestBody)
    return apiClient.post(`/putaways/`+id, requestBody);
}
