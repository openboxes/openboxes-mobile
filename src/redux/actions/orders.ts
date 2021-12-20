export const GET_ORDERS_REQUEST = 'GET_ORDERS_REQUEST';
export const GET_STOCK_MOVEMENT_LIST = 'GET_STOCK_MOVEMENT_LIST';
export const GET_ORDERS_REQUEST_SUCCESS = 'GET_ORDERS_REQUEST_SUCCESS';
export const GET_ORDERS_REQUEST_FAIL = 'GET_ORDERS_REQUEST_FAIL';

export const GET_PICKLIST_REQUEST = 'GET_PICKLIST_REQUEST';
export const GET_PICKLIST_ITEM_REQUEST = 'GET_PICKLIST_ITEM_REQUEST';
export const SUBMIT_PICKLIST_ITEM_PICKUP_REQUEST = 'SUBMIT_PICKLIST_ITEM_PICKUP_REQUEST';
export const SUBMIT_PICKLIST_ITEM_PICKUP_SUCCESS = 'SUBMIT_PICKLIST_ITEM_PICKUP_SUCCESS';

export const GET_PICKLIST_REQUEST_SUCCESS = 'GET_PICKLIST_REQUEST_SUCCESS';
export const GET_PICKLIST_REQUEST_SUCCESS_FAIL =
  'GET_PICKLIST_REQUEST_SUCCESS_FAIL';

export function getOrdersAction(value: string | null, callback: (products: any) => void) {
  return {
    type: GET_ORDERS_REQUEST,
    payload: value,
    callback,
  };
}

export function getPickListAction(
  id: string,
  callback: (products: any) => void,
) {
  return {
    type: GET_PICKLIST_REQUEST,
    payload: { id },
    callback,
  };
}

export function getPickListItemAction(
    id: string,
    callback: (products: any) => void,
) {
  return {
    type: GET_PICKLIST_ITEM_REQUEST,
    payload: { id },
    callback,
  };
}

export function submitPickListItem(
    id: string,
    requestBody: any,
    callback: (data: any) => void,
) {
  return {
    type: SUBMIT_PICKLIST_ITEM_PICKUP_REQUEST,
    payload: { id, requestBody },
    callback,
  };
}

export function getStockMovements(direction: string | null, status: string | null, callback: (products: any) => void) {
  return {
    type: GET_STOCK_MOVEMENT_LIST,
    payload: { direction, status },
    callback,
  };
}
