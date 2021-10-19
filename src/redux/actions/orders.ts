export const GET_ORDERS_REQUEST = 'GET_ORDERS_REQUEST';
export const GET_ORDERS_REQUEST_SUCCESS = 'GET_ORDERS_REQUEST_SUCCESS';
export const GET_ORDERS_REQUEST_FAIL = 'GET_ORDERS_REQUEST_FAIL';

export const GET_PICKLIST_REQUEST = 'GET_PICKLIST_REQUEST';
export const GET_PICKLIST_ITEM_REQUEST = 'GET_PICKLIST_ITEM_REQUEST';
export const SUBMIT_PICKLIST_ITEM_PICKUP_REQUEST = 'SUBMIT_PICKLIST_ITEM_PICKUP_REQUEST';
export const GET_PICKLIST_REQUEST_SUCCESS = 'GET_PICKLIST_REQUEST_SUCCESS';
export const GET_PICKLIST_REQUEST_SUCCESS_FAIL =
  'GET_PICKLIST_REQUEST_SUCCESS_FAIL';

export function getOrdersAction(callback: (products: any) => void) {
  return {
    type: GET_ORDERS_REQUEST,
    callback,
  };
}

export function getPickListAction(
  id: string,
  callback: (products: any) => void,
) {
  console.log('action OK');
  return {
    type: GET_PICKLIST_REQUEST,
    payload: {id},
    callback,
  };
}

export function getPickListItemAction(
    id: string,
    callback: (products: any) => void,
) {
  console.log('action OK');
  return {
    type: GET_PICKLIST_ITEM_REQUEST,
    payload: {id},
    callback,
  };
}

export function submitPickListItem(
    id: string,
    requestBody: any,
    callback: (products: any) => void,
) {
  console.log('action OK');
  return {
    type: SUBMIT_PICKLIST_ITEM_PICKUP_REQUEST,
    payload: {id, requestBody},
    callback,
  };
}
