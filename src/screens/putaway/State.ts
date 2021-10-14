import Order from "../../../data/order/Order";
import PutAway from "../../../app/data/putaway/PutAway";

export enum NavigationStateType {
  Here,
  PutAwayDetail,
  PutAwayToBinLocation = 2
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

export class NavigationStatePutAwayDetail extends NavigationState {
  order: Order

  constructor(order: Order) {
    super(NavigationStateType.PutAwayDetail)
    this.order = order
  }
}

export interface State {
  error: string | null
  putAwayList: PutAway[] | null
  putAway: PutAway | null
  navigationState: NavigationState
  orderId: string | null
}
