import apiClient from '../utils/ApiClient';

const url =
  '/locations?locationTypeCode=DEPOT&activityCodes=MANAGE_INVENTORY&applyUserFilter=true';

export function getLocations() {
  return apiClient.get(url);
}

export function setCurrentLocation(location: any) {
  return apiClient.put(`/chooseLocation/${location.id}`);
}

export function searchLocationByLocationNumber(locationNumber: string) {
  return apiClient.get(`/locations/${locationNumber}`);
}
export function getBinLocations() {
  return apiClient.get(`/internalLocations`);
}

export function internalLocations(id: string) {
  return apiClient.get(`/internalLocations/?location.id=${id}`);
}

export function internalLocationsDetails(id: string,location:string) {
  return apiClient.get(`/internalLocations/${id}/details?location.id=${location}`);
}

export function fetchProductSummary(id: string) {
  return apiClient.get(`/locations/${id}/productSummary`);
}