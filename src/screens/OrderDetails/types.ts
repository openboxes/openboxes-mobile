import PickList from '../../data/picklist/PickList';
import {Item} from '../../data/picklist/Item';
import {Order} from '../../data/order/Order';
import {PicklistItem} from "../../data/picklist/PicklistItem";

export interface State {
  pickList: PickList | null;
  // pickListItems: PicklistItem[] | [];
  error: string | null;
  initialPicklistItemIndex: number | 0;
}

export interface PicklistOwnProps {
  exit: () => void;
  pickList: PickList | null;
  order: Order;
  pickListItem: PicklistItem[] | [];
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
  // useNavigation: () => void;
  getPickListAction: (id: any, callback: (data: any) => void) => void;
}

export type Props = PicklistOwnProps & StateProps & DispatchProps & OwnProps;
