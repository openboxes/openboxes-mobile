export const UPDATE_INTERNAL_STOCK_TRANSFER = 'UPDATE_INTERNAL_STOCK_TRANSFER';
export const UPDATE_INTERNAL_STOCK_TRANSFER_SUCCESS =
  'UPDATE_INTERNAL_STOCK_TRANSFER_SUCCESS';
export const FETCH_STOCK_MOVEMENTS = 'FETCH_STOCK_MOVEMENTS';
export const FETCH_STOCK_MOVEMENTS_SUCCESS = 'FETCH_STOCK_MOVEMENTS_SUCCESS';
export const STOCK_TRANSFERS_REQUEST = 'STOCK_TRANSFERS_REQUEST';
export const STOCK_TRANSFERS_REQUEST_SUCCESS =
  'STOCK_TRANSFERS_REQUEST_SUCCESS';
export const FETCH_STOCK_TRANSFERS = 'FETCH_STOCK_TRANSFERS';
export const FETCH_STOCK_TRANSFERS_SUCCESS = 'FETCH_STOCK_TRANSFERS_SUCCESS';
export const FETCH_STOCK_TRANSFERS_DETAILS = 'FETCH_STOCK_TRANSFERS_DETAILS';
export const POST_COMPLETE_STOCK_TRANSFER = 'POST_COMPLETE_STOCK_TRANSFER';

export const updateStockTransfer = (
  data: any,
  callback: (data: any) => void
) => {
  return {
    type: UPDATE_INTERNAL_STOCK_TRANSFER,
    payload: { data },
    callback
  };
};

export const getStockMovements = (
  id: string,
  callback: (data: any) => void
) => {
  return {
    type: FETCH_STOCK_MOVEMENTS,
    payload: { id },
    callback
  };
};

export function stockTransfersAction(
  data: any,
  callback?: (products: any) => void
) {
  return {
    type: STOCK_TRANSFERS_REQUEST,
    payload: data,
    callback
  };
}

export const getStockTransfers = (callback: (data: any) => void) => {
  return {
    type: FETCH_STOCK_TRANSFERS,
    callback
  };
};

export function getStockTransfersSummary(
  id: string,
  callback: (data: any) => void
) {
  return {
    type: FETCH_STOCK_TRANSFERS_DETAILS,
    payload: { id },
    callback
  };
}

export const completeStockTransfer = (
  id: string,
  callback: (data: any) => void
) => {
  return {
    type: POST_COMPLETE_STOCK_TRANSFER,
    payload: { id },
    callback
  };
};
