import BinLocation from "./BinLocation";
import Product from "../product/Product";
import InventoryItem from "./InventoryItem";

export interface PicklistItem {
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
    quantityCanceled: number,

    "version": number,
    "picklist.id": string,
    "requisitionItem.id": string,
    "product.id": string,
    "product.name": string,
    "inventoryItem.id": string,
    "binLocation.id": null,
    "binLocation.name": null,
    "binLocation.locationNumber": null,
    "binLocation.locationType": null,
    "binLocation.zoneId": null,
    "binLocation.zoneName": null,
    "requisitionItemId": string,
    "orderItemId": null,
    "binLocationId": null,
    "inventoryItemId": string,
    "quantity": number,
    "quantityToPick": number,
    "picker.id": string | null,
    "picker.name": string | null,
    "datePicked": null,
    "quantityOnHand": number,
    "quantityAvailableToPromise": number,
    "unitOfMeasure": string,

    // for picking validation purposes
    scannedLotNumber?: string | null,
    scannedBinLocation?: string | null
    shortage?: boolean | null
    shortageReasonCode?: String | null
}
export  interface GetPickListItemsApiResponse {
    data: PicklistItem[];
}
export  interface GetPickListItemApiResponse {
    data: PicklistItem;
}
