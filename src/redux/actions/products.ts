export const GET_PRODUCTS_REQUEST = 'GET_PRODUCTS_REQUEST';
export const GET_PRODUCTS_REQUEST_SUCCESS = 'GET_PRODUCTS_REQUEST_SUCCESS';
export const GET_PRODUCTS_REQUEST_FAIL = 'GET_PRODUCTS_REQUEST_FAIL';

export const SEARCH_PRODUCTS_BY_NAME_REQUEST =
  'SEARCH_PRODUCTS_BY_NAME_REQUEST';
export const SEARCH_PRODUCTS_BY_NAME_REQUEST_SUCCESS =
  'SEARCH_PRODUCTS_BY_NAME_REQUEST_SUCCESS';
export const SEARCH_PRODUCTS_BY_NAME_REQUEST_FAIL =
  'SEARCH_PRODUCTS_BY_NAME_REQUEST_FAIL';

export const SEARCH_PRODUCT_BY_CODE_REQUEST = 'SEARCH_PRODUCT_BY_CODE_REQUEST';
export const SEARCH_PRODUCT_BY_CODE_REQUEST_SUCCESS =
  'SEARCH_PRODUCT_BY_CODE_REQUEST_SUCCESS';
export const SEARCH_PRODUCT_BY_CODE_REQUEST_FAIL =
  'SEARCH_PRODUCT_BY_CODE_REQUEST_FAIL';

export const SEARCH_PRODUCT_GLOBALY_REQUEST = 'SEARCH_PRODUCT_GLOBALY_REQUEST';
export const SEARCH_PRODUCT_GLOBALY_REQUEST_SUCCESS =
  'SEARCH_PRODUCT_GLOBALY_REQUEST_SUCCESS';
export const SEARCH_PRODUCT_GLOBALY_REQUEST_FAIL =
  'SEARCH_PRODUCT_GLOBALY_REQUEST_FAIL';

export const SEARCH_PRODUCTS_BY_CATEGORY_REQUEST =
  'SEARCH_PRODUCTS_BY_CATEGORY_REQUEST';
export const SEARCH_PRODUCTS_BY_CATEGORY_REQUEST_SUCCESS =
  'SEARCH_PRODUCTS_BY_CATEGORY_REQUEST_SUCCESS';
export const SEARCH_PRODUCTS_BY_CATEGORY_REQUEST_FAIL =
  'SEARCH_PRODUCTS_BY_CATEGORY_REQUEST_FAIL';

export function getProductsAction(callback: (products: any) => void) {
  return {
    type: GET_PRODUCTS_REQUEST,
    callback,
  };
}

export function searchProductsByNameAction(
  name: string,
  callback: (searchedProducts: any) => void,
) {
  return {
    type: SEARCH_PRODUCTS_BY_NAME_REQUEST,
    payload: {name},
    callback,
  };
}
export function searchProductByCodeAction(
  productCode: string,
  callback: (searchedProducts: any) => void,
) {
  return {
    type: SEARCH_PRODUCT_BY_CODE_REQUEST,
    payload: {productCode},
    callback,
  };
}

export function searchProductGloballyAction(
  value: string,
  callback: (searchedProducts: any) => void,
) {
  return {
    type: SEARCH_PRODUCT_GLOBALY_REQUEST,
    payload: {value},
    callback,
  };
}

export function searchProductSByCategoryAction(
  category: any,
  callback: (searchedProducts: any) => void,
) {
  return {
    type: SEARCH_PRODUCTS_BY_CATEGORY_REQUEST,
    payload: {category},
    callback,
  };
}
