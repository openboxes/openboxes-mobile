import {ProductCategory} from "./category/ProductCategory";
import {ProductAvailability} from "./availability/ProductAvailability";
import {Attributes} from "./Attributes";
import {ProductType} from "./ProductType";
import {ProductImage} from "./ProductImage";

export default interface Product {
  id: string
  productCode: string
  name: string
  description?: string | null
  pricePerUnit?: number | 0.00
  category: ProductCategory,
  availability: ProductAvailability,
  attributes: Attributes[],
  productType: ProductType,
  images: ProductImage[]
}
