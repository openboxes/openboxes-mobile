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

export class NavigationStateOrderDetails extends NavigationState {
  order: Order

  constructor(order: Order) {
    super(NavigationStateType.OrderDetails)
    this.order = order
  }
}

export interface State {
  error: string | null
  allOrders: Order[] | null

  navigationState: NavigationState
}
