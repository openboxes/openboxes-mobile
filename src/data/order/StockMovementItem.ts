import Product from "../product/Product";
import BinLocation from "../picklist/BinLocation";
import InventoryItem from "../picklist/InventoryItem";

export default interface StockMovementItem{
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
