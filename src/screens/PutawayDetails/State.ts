import Putaway from "../../../app/data/putaway/Putaway";
import {Order} from "../../data/order/Order";

export enum NavigationStateType {
  Here,
  PutawayDetails,
  PutawayToBinLocation
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

export class NavigationStatePutawayDetails extends NavigationState {
  order: Order

  constructor(order: Order) {
    super(NavigationStateType.PutawayDetails)
    this.order = order
  }
}

export interface State {
  error: string | null;
  putawayList: Putaway[] | null;
  putaway: Putaway | null;
  navigationState: NavigationState;
  orderId: string | null;
}
