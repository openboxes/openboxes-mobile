import Product from "../product/Product";
import BinLocation from "./BinLocation";

export default interface Item{
  id: String
  status: String,
  productCode: String,
  product: Product,
  lotNumber: String,
  expirationDate: Date,
  quantityPicked: number,
  quantityRequired: number
  reasonCode: String,
  comment: String
  binLocation: BinLocation,

}
