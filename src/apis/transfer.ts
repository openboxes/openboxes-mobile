import apiClient from '../utils/ApiClient';

export function updateStockTransfers(requestBody: any) {
  return apiClient.post('/stockTransfers', requestBody);
}

export function getStockMovements(id: string) {
  return apiClient.get('/stockMovements/' + id);
}
