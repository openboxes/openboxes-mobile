export const UPDATE_INTERNAL_STOCK_TRANSFER = 'UPDATE_INTERNAL_STOCK_TRANSFER';
export const UPDATE_INTERNAL_STOCK_TRANSFER_SUCCESS = "UPDATE_INTERNAL_STOCK_TRANSFER_SUCCESS";
export const FETCH_STOCK_MOVEMENTS = "FETCH_STOCK_MOVEMENTS"
export const FETCH_STOCK_MOVEMENTS_SUCCESS = "FETCH_STOCK_MOVEMENTS_SUCCESS"

export const updateStockTransfer = (data: any) => {
    return {
        type: UPDATE_INTERNAL_STOCK_TRANSFER,
        payload: {data}
    };
}

export const getStockMovements = (id: string, callback: (data: any) => void,
) => {
    return {
        type: FETCH_STOCK_MOVEMENTS,
        payload: {id},
        callback
    };
}