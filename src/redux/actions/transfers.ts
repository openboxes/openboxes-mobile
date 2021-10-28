export const STOCK_TRANSFERS_REQUEST = 'STOCK_TRANSFERS_REQUEST';
export const STOCK_TRANSFERS_REQUEST_SUCCESS = 'STOCK_TRANSFERS_REQUEST_SUCCESS';

export function stockTransfersAction(data: any, callback?: (products: any) => void) {
    return {
        type: STOCK_TRANSFERS_REQUEST,
        payload: data,
        callback,
    };
}
