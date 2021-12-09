export const GET_LOCATIONS_REQUEST = 'GET_LOCATIONS_REQUEST';
export const GET_LOCATIONS_REQUEST_SUCCESS = 'GET_LOCATIONS_REQUEST_SUCCESS';
export const GET_LOCATIONS_REQUEST_FAIL = 'GET_LOCATIONS_REQUEST_FAIL';

export const GET_BIN_LOCATIONS_REQUEST = 'GET_BIN_LOCATIONS_REQUEST';
export const GET_BIN_LOCATIONS_REQUEST_SUCCESS = 'GET_BIN_LOCATIONS_REQUEST_SUCCESS';

export const SET_CURRENT_LOCATION_REQUEST = 'SET_CURRENT_LOCATION_REQUEST';
export const SET_CURRENT_LOCATION_REQUEST_SUCCESS =
    'SET_CURRENT_LOCATION_REQUEST_SUCCESS';
export const SET_CURRENT_LOCATION_REQUEST_FAIL =
    'SET_CURRENT_LOCATION_REQUEST_FAIL';
export const GET_LOCATION_FROM_NUMBER = 'GET_LOCATION_FROM_NUMBER';
export const GET_INTERNAL_LOCATION_FROM_NUMBER = 'GET_INTERNAL_LOCATION_FROM_NUMBER'
export const GET_INTERNAL_LOCATIONS_SUCCESS = 'GET_INTERNAL_LOCATIONS_SUCCESS';

export const GET_PRODUCT_SUMMARY_FROM_LOCATION = "GET_PRODUCT_SUMMARY_FROM_LOCATION"
export const GET_PRODUCT_SUMMARY_FROM_LOCATION_SUCCESS = "GET_PRODUCT_SUMMARY_FROM_LOCATION_SUCCESS"

export const GET_INTERNAL_LOCATION_DETAIL = "GET_INTERNAL_LOCATION_DETAIL"
export const GET_INTERNAL_LOCATIONS_DETAIL_SUCCESS = "GET_INTERNAL_LOCATIONS_DETAIL_SUCCESS"

export const GET_INTERNAL_LOCATION_DETAIL_REQUEST = "GET_INTERNAL_LOCATION_DETAIL_REQUEST"
export const GET_INTERNAL_LOCATION_DETAIL_SUCCESS = "GET_INTERNAL_LOCATION_DETAIL_SUCCESS"

export function getLocationsAction(callback: (products: any) => void) {
    return {
        type: GET_LOCATIONS_REQUEST,
        callback,
    };
}

export function getBinLocationsAction(callback?: () => void) {
    return {
        type: GET_BIN_LOCATIONS_REQUEST,
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
) {
    return {
        type: GET_LOCATION_FROM_NUMBER,
        payload: {locationNumber},
        callback,
    };
}


export function getInternalLocations(location: string, callback: (data: any) => void,) {
    return {
        type: GET_INTERNAL_LOCATION_FROM_NUMBER,
        payload: {location},
        callback,
    };
}

export function getInternalLocationDetails(id: string,location: string, callback: (data: any) => void,) {
    return {
        type: GET_INTERNAL_LOCATION_DETAIL,
        payload: {id, location},
        callback,
    };
}

export function getInternalLocationDetail(id: string, callback: (data: any) => void,) {
    return {
        type: GET_INTERNAL_LOCATION_DETAIL_REQUEST,
        payload: {id},
        callback,
    };
}

export function getLocationProductSummary(location: string, callback: (data: any) => void) {
    return {
        type: GET_PRODUCT_SUMMARY_FROM_LOCATION,
        payload: {location},
        callback,
    };
};