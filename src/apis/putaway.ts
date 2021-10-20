import apiClient from '../utils/ApiClient';

export function fetchPutAwayFromOrder(orderNumber: string) {
    return apiClient.get(`/putaways/${orderNumber}`);
}
