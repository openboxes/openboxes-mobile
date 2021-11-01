export const GET_LOCATIONS_REQUEST = 'GET_LOCATIONS_REQUEST';
export const GET_LOCATIONS_REQUEST_SUCCESS = 'GET_LOCATIONS_REQUEST_SUCCESS';
export const GET_LOCATIONS_REQUEST_FAIL = 'GET_LOCATIONS_REQUEST_FAIL';

export const SET_CURRENT_LOCATION_REQUEST = 'SET_CURRENT_LOCATION_REQUEST';
export const SET_CURRENT_LOCATION_REQUEST_SUCCESS =
  'SET_CURRENT_LOCATION_REQUEST_SUCCESS';
export const SET_CURRENT_LOCATION_REQUEST_FAIL =
  'SET_CURRENT_LOCATION_REQUEST_FAIL';
export const GET_LOCATION_FROM_NUMBER = 'GET_LOCATION_FROM_NUMBER';
export const GET_INTERNAL_LOCATION_FROM_NUMBER = 'GET_INTERNAL_LOCATION_FROM_NUMBER'
export const GET_INTERNAL_LOCATIONS_SUCCESS = 'GET_INTERNAL_LOCATIONS_SUCCESS';

export function getLocationsAction(callback: (products: any) => void) {
  return {
    type: GET_LOCATIONS_REQUEST,
    callback,
  };
}

export function setCurrentLocationAction(
  location: any,
  callback: (data: any) => void,
) {
  return {
    type: SET_CURRENT_LOCATION_REQUEST,
    payload: {location},
    callback,
  };
}

export function searchLocationByLocationNumber(
    locationNumber: string,
    callback: (data: any) => void,
){
  return {
    type: GET_LOCATION_FROM_NUMBER,
    payload: {locationNumber},
    callback,
  };
}


export function getInternalLocations(location:string, callback: (data: any) => void,){
  return {
    type: GET_INTERNAL_LOCATION_FROM_NUMBER,
    payload: {location},
    callback,
  };
}