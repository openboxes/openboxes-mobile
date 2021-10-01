import PickList from "../../../data/picklist/PickList";
import Item from "../../../data/picklist/Item";
import Order from "../../../data/order/Order";



export enum NavigationStateType {
  Here,
  OrderDetails
}

export abstract class NavigationState {
  type: NavigationStateType

  protected constructor(type: NavigationStateType) {
    this.type = type
  }
}

export class NavigationStateHere extends NavigationState {
  constructor() {
    super(NavigationStateType.Here);
  }
}

export class NavigationStatePickItemDetails extends NavigationState {
  order: Order
  item: Item
  constructor(order: Order, item: Item) {
    super(NavigationStateType.OrderDetails)
    this.order = order
    this.item = item
  }
}
export class NavigationStateOrderDetails extends NavigationState {
  order: Order
  constructor(order: Order) {
    super(NavigationStateType.OrderDetails)
    this.order = order
  }
}

export interface State {
  pickList: PickList | null
  pickListItems: Item[] | []
  error: string | null
  navigationState: NavigationState
}
