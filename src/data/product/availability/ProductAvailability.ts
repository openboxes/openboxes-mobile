import {ProductQuantityOnHand} from "./ProductQuantityOnHand";
import {ProductQuantityAvailableToPromise} from "./ProductQuantityAvailableToPromise";
import {ProductQuantityAllocated} from "./ProductQuantityAllocated";
import {ProductQuantityOnOrder} from "./ProductQuantityOnOrder";

export interface ProductAvailability {
  quantityOnHand: ProductQuantityOnHand
  quantityAvailableToPromise: ProductQuantityAvailableToPromise
  quantityAllocated: ProductQuantityAllocated
  quantityOnOrder: ProductQuantityOnOrder
}