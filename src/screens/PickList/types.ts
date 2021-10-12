import {Item} from '../../data/picklist/Item';
import {Order} from '../../data/order/Order';

export interface State {
  pickListItem: Item | null;
  error: string | null;
  order: Order | null;
}

export interface PickListProps {
  exit: () => void;
  pickListItem: Item | null;
  order: Order | null;
}

export interface OwnProps {
  route: any;
}

export interface StateProps {
  //no-op
}
export interface DispatchProps {
  showScreenLoading: (message?: string) => void;
  hideScreenLoading: () => void;
}

export type Props = PickListProps & StateProps & OwnProps & DispatchProps;
