import {ProductCategory} from "./ProductCategory";

export default interface Product {
  id: string
  productCode: string
  name: string
  description?: string | null
  category: ProductCategory
}
