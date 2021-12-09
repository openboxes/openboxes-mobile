import Product from "../product/Product";
import BinLocation from "./BinLocation";
import InventoryItem from "./InventoryItem";

export default interface PicklistItem{
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
  quantityAvailable: number,

  "version": number,
  "picklist.id": string,
  "requisitionItem.id": string,
  "product.id": string,
  "product.name": string,
  "inventoryItem.id": string,
  "binLocation.id": null,
  "binLocation.name": null,
  "binLocation.zoneId": null,
  "binLocation.zoneName": null,
  "requisitionItemId": string,
  "orderItemId": null,
  "binLocationId": null,
  "inventoryItemId": string,
  "quantity": number,
  "quantityToPick": number,
  "picker.id": null,
  "datePicked": null,
  "quantityOnHand": number,
  "quantityAvailableToPromise": number,
  "unitOfMeasure": string
}
