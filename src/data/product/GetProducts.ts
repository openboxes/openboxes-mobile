import Product from "./Product";
import apiClient from "../../utils/ApiClient";

const url = "/generic/product"

interface GetProductsApiResponse {
  data: Product[]
}

export default function getProducts(): Promise<Product[]> {
  return apiClient.get(url)
    .then((response: GetProductsApiResponse) => response.data)
}
