

export const UPDATE_INTERNAL_STOCK_TRANSFER = 'UPDATE_INTERNAL_STOCK_TRANSFER';


export function updateStockTransfer(
    requestBody: any,
    callback: (products: any) => void,
) {
    console.log('action OK');
    return {
        type: UPDATE_INTERNAL_STOCK_TRANSFER,
        payload: { requestBody},
        callback,
    };
}
