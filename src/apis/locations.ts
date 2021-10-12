import apiClient from '../utils/ApiClient';

const url =
  '/locations?locationTypeCode=DEPOT&activityCodes=MANAGE_INVENTORY&applyUserFilter=true';

export function getLocations() {
  return apiClient.get(url);
}
export function setCurrentLocation(location: any) {
  return apiClient.put(`/chooseLocation/${location.id}`);
}
