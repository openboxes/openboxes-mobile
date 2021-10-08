import apiClient from "../../utils/ApiClient";
import Order from "./Order";

const url = "/stockMovements?exclude=lineItems&direction=OUTBOUND"

interface GetOrdersApiResponse {// StockMovement Object
  data: Order[]
}

export default function getOrders(query: string | null): Promise<Order[]> {
  let getUrl = url
  if(query!=null){
    getUrl += "&orderNumber="+query
  }
  return apiClient.get(getUrl)
    .then((response: GetOrdersApiResponse) => response.data)
}
