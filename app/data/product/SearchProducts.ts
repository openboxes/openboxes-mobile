import Product from "./Product";
import apiClient from "../../utils/ApiClient";
import {AxiosRequestConfig} from "axios";

const url = "/generic/product/search"

interface SearchProductsApiRequest {
  searchAttributes: {
    property: string,
    operator: string,
    value: string
  }
}

interface SearchProductsApiResponse {
  data: Product[]
}

export default function searchProducts(name: string): Promise<Product[]> {
  const request: SearchProductsApiRequest = {
    searchAttributes: {
      property: "name",
      operator: "like",
      value: `${name}%`
    }
  }
  const config: AxiosRequestConfig = {
    data: request
  }
  return apiClient.get(url, config)
    .then((response: SearchProductsApiResponse) => response.data)
}
