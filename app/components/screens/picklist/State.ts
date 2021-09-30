import PickList from "../../../data/picklist/PickList";
import Item from "../../../data/picklist/Item";
import Order from "../../../data/order/Order";
import Product from "../../../data/product/Product";
import BinLocation from "../../../data/picklist/BinLocation";

export interface State {
  pickListItem: Item | null
  error: string | null
  order: Order | null
  productSearchQuery: string
  binLocationSearchQuery: string
  quantityPicked: string
  product: Product | null
  binLocation: BinLocation | null
}
