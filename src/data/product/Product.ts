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
  images: ProductImage[],
<<<<<<< HEAD:app/data/product/Product.ts
  unitOfMeasure: string

=======
  quantityAllocated:number,
  quantityAvailableToPromise:number,
  quantityOnHand:number,
  quantityOnOrder:number,
  status?:string
  unitOfMeasure:string
  image?:any
  availableItems:any
>>>>>>> 066318bb09b5e7fa073028447bd7df3b1737ed16:src/data/product/Product.ts
}
