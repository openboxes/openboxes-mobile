import Item from "../../../data/picklist/Item";
import Order from "../../../data/order/Order";

export  interface PickListProps{
  exit: () => void
  pickListItem: Item | null
  order: Order | null
}

export interface StateProps {
  //no-op
}
export interface DispatchProps {
  showProgressBar: (message?: string) => void
  hideProgressBar: () => void
}

export type Props = PickListProps & StateProps & DispatchProps
