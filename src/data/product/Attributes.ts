import {ProductUnitOfMeasure} from "./availability/ProductUnitOfMeasure";

export interface Attributes{
  code: String | null
  name: String | null
  value: String | null
  unitOfMeasure: ProductUnitOfMeasure | null

}