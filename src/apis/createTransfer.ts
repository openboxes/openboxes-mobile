import { StockTransferPayload } from '../screens/CreateTransfer/types';
import apiClient from '../utils/ApiClient';

export function getStockTransferCandidates(facilityId: string) {
  return apiClient.get(`/stockTransfers/candidates?location.id=${encodeURIComponent(facilityId)}`);
}

export function lookupBarcodeProduct(code: string) {
  return apiClient.get(`/barcodes/${encodeURIComponent(code)}`);
}

export function lookupLocationByCode(code: string) {
  return apiClient.get(`/locations/${encodeURIComponent(code)}`);
}

export function searchDestinationBins(searchTerm: string) {
  const term = encodeURIComponent(searchTerm || '');
  return apiClient.get(
    `/internalLocations/search?searchTerm=${term}` +
      '&locationTypeCode=BIN_LOCATION&locationTypeCode=INTERNAL' +
      '&ignoreActivityCodes=RECEIVE_STOCK'
  );
}

export function postStockTransfer(payload: StockTransferPayload) {
  return apiClient.post('/stockTransfers', payload);
}

export function getStockTransferById(id: string) {
  return apiClient.get(`/stockTransfers/${encodeURIComponent(id)}`);
}

export function putStockTransfer(id: string, body: any) {
  return apiClient.put(`/stockTransfers/${encodeURIComponent(id)}`, body);
}
