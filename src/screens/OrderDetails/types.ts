import PickList from '../../data/picklist/PickList';
import {Item} from '../../data/picklist/Item';
import {Order} from '../../data/order/Order';

export interface State {
  pickList: PickList | null;
  pickListItems: Item[] | [];
  error: string | null;
}

export interface PicklistOwnProps {
  exit: () => void;
  pickList: PickList | null;
  order: Order;
  pickListItem: Item[] | [];
}
export interface OwnProps {
  navigation: any;
  route: any;
}

export interface StateProps {
  //no-op
}

export interface DispatchProps {
  showScreenLoading: (message?: string) => void;
  hideScreenLoading: () => void;
  getPickListAction: (id: any, callback: (data: any) => void) => void;
}

export type Props = PicklistOwnProps & StateProps & DispatchProps & OwnProps;
