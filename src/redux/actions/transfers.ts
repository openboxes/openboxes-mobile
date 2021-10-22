

export const UPDATE_INTERNAL_STOCK_TRANSFER = 'UPDATE_INTERNAL_STOCK_TRANSFER';
export const UPDATE_INTERNAL_STOCK_TRANSFER_SUCCESS="UPDATE_INTERNAL_STOCK_TRANSFER_SUCCESS";

export const updateStockTransfer=(data: any) =>{
    return {
        type: UPDATE_INTERNAL_STOCK_TRANSFER,
        payload:  {data}
    };
}
