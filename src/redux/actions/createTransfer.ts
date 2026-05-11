export const GET_STOCK_TRANSFER_CANDIDATES = 'CREATE_TRANSFER/GET_CANDIDATES';
export const LOOKUP_TRANSFER_BARCODE = 'CREATE_TRANSFER/LOOKUP_BARCODE';
export const LOOKUP_LOCATION_BY_CODE = 'CREATE_TRANSFER/LOOKUP_LOCATION';
export const SEARCH_PRODUCT_OR_LOCATION = 'CREATE_TRANSFER/SEARCH_PRODUCT_OR_LOCATION';
export const SEARCH_DESTINATION_BINS = 'CREATE_TRANSFER/SEARCH_DESTINATION_BINS';
export const SUBMIT_CREATE_TRANSFER = 'CREATE_TRANSFER/SUBMIT';
export const COMPLETE_CREATE_TRANSFER = 'CREATE_TRANSFER/COMPLETE';

type Callback<T = any> = (data: T) => void;

export function getStockTransferCandidatesAction(facilityId: string, callback: Callback, suppressLoading?: boolean) {
  return {
    type: GET_STOCK_TRANSFER_CANDIDATES,
    payload: { facilityId },
    callback,
    suppressLoading
  };
}

export function lookupTransferBarcodeAction(code: string, callback: Callback) {
  return {
    type: LOOKUP_TRANSFER_BARCODE,
    payload: { code },
    callback
  };
}

export function lookupLocationByCodeAction(code: string, callback: Callback) {
  return {
    type: LOOKUP_LOCATION_BY_CODE,
    payload: { code },
    callback
  };
}

export function searchProductOrLocationAction(searchTerm: string, callback: Callback, suppressLoading?: boolean) {
  return {
    type: SEARCH_PRODUCT_OR_LOCATION,
    payload: { searchTerm },
    callback,
    suppressLoading
  };
}

export function searchDestinationBinsAction(searchTerm: string, callback: Callback, suppressLoading?: boolean) {
  return {
    type: SEARCH_DESTINATION_BINS,
    payload: { searchTerm },
    callback,
    suppressLoading
  };
}

export function submitCreateTransferAction(payload: any, callback: Callback) {
  return {
    type: SUBMIT_CREATE_TRANSFER,
    payload,
    callback
  };
}

export function completeCreateTransferAction(transferId: string, callback: Callback) {
  return {
    type: COMPLETE_CREATE_TRANSFER,
    payload: { transferId },
    callback
  };
}
