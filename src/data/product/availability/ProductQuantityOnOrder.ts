import {ProductUnitOfMeasure} from "./ProductUnitOfMeasure";

export interface ProductQuantityOnOrder {
  value: number | 0
  unitOfMeasure: ProductUnitOfMeasure
}