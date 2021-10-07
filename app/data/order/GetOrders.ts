import apiClient from "../../utils/ApiClient";
import Order from "./Order";

const url = "/stockMovements?exclude=lineItems&direction=OUTBOUND"

interface GetOrdersApiResponse {// StockMovement Object
  data: Order[]
}

export default function getOrders(locationId: string): Promise<Order[]> {
  return apiClient.get(url+"&origin.id="+locationId)
    .then((response: GetOrdersApiResponse) => response.data)
}
