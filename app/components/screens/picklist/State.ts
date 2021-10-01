import PickList from "../../../data/picklist/PickList";
import Item from "../../../data/picklist/Item";
import Order from "../../../data/order/Order";

export interface State {
  pickListItem: Item | null
  error: string | null
  order: Order | null
}
