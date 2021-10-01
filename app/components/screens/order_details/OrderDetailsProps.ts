import PickList from "../../../data/picklist/PickList";
import Order from "../../../data/order/Order";
import Item from "../../../data/picklist/Item";

export interface PicklistOwnProps{
  exit: () => void
  pickList: PickList | null
  order: Order
  pickListItem: Item[] | []
}

export interface StateProps {
  //no-op
}

export interface DispatchProps {
  showProgressBar: (message?: string) => void
  hideProgressBar: () => void
}

export type Props = PicklistOwnProps & StateProps & DispatchProps
