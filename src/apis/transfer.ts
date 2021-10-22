import apiClient from "../utils/ApiClient";

export function updateStockTransfer( requestBody: any) {
    console.debug("stock transfer")
    console.debug(requestBody)
    return apiClient.post(`/stockTransfers/`, requestBody);
}
