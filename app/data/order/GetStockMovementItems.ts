import apiClient from "../../utils/ApiClient";
import StockMovementItem from "./StockMovementItem";

const url = "/stockMovements/"


interface StockMovementItemsResponse {
  data: StockMovementItem[]
}

export default function getStockMovementItems(id: string): Promise<StockMovementItem[]>{
  const finalUrl = url + id + "/stockMovementItems"
  console.debug("finalUrl"+finalUrl)
  return apiClient.get(finalUrl)
    .then((response: StockMovementItemsResponse) => response.data)

}
