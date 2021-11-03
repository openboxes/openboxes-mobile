import apiClient from "../utils/ApiClient";

export function stockTransfers(data: any) {
    return apiClient.post(`/stockTransfers`, data);
}
