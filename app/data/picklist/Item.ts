import Product from "../product/Product";
import BinLocation from "./BinLocation";
import InventoryItem from "./InventoryItem";

export default interface Item{
  id: string | ""
  status: String,
  productCode: String,
  product: Product,
  lotNumber: String,
  expirationDate: Date,
  quantityPicked: number,
  quantityRequired: number
  reasonCode: String,
  comment: String
  binLocation: BinLocation | null,
  inventoryItem: InventoryItem | null,
  quantityRequested: number,
  quantityRemaining: number,
  quantityAvailable: number
}
