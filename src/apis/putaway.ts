import apiClient from '../utils/ApiClient';

export function fetchPutAwayFromOrder(orderId: string) {
    return apiClient.get(`/putaways/${orderId}`);
}
