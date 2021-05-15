import {ProductCategory} from "./ProductCategory";
import apiClient from "../../../utils/ApiClient";

const url = "/generic/category"

interface GetProductCategoriesApiResponse {
  data: ProductCategory[]
}

export default function getProductCategories(): Promise<ProductCategory[]> {
  return apiClient.get(url)
    .then((response: GetProductCategoriesApiResponse) => response.data)
}
