import apiClient from "../../utils/ApiClient";
import Order from "./Order";

const url = "/stockMovements?exclude=lineItems&direction=OUTBOUND"

interface GetOrdersApiResponse {
  data: Order[]
}

export default function getOrders(): Promise<Order[]> {
  return apiClient.get(url)
    .then((response: GetOrdersApiResponse) => response.data)
}
