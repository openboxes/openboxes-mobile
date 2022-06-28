import PickList from '../../data/picklist/PickList';
import { Order } from '../../data/order/Order';
import { PicklistItem } from '../../data/picklist/PicklistItem';

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

export type Props = PicklistOwnProps & OwnProps;
