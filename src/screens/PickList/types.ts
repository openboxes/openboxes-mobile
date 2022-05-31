import { Order } from '../../data/order/Order';
import Product from '../../data/product/Product';
import BinLocation from '../../data/picklist/BinLocation';
import { PicklistItem } from '../../data/picklist/PicklistItem';

export interface State {
  pickListItem: PicklistItem | null;
  error: string | null;
  order: Order | null;
  productSearchQuery: string | '';
  binLocationSearchQuery: string | '';
  quantityPicked: string | '0';
  product: Product | null;
  binLocation: BinLocation | null;
}

export interface PickListProps {
  exit: () => void;
  pickListItem: PicklistItem | null;
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
  getPickListItemAction: (id: any, callback: (data: any) => void) => void;
  submitPickListItem: (id: string, requestBody: any, callback: (data: any) => void) => void;
  searchProductByCodeAction: (productCode: string, callback: (data: any) => void) => void;
  searchLocationByLocationNumber: (locationNumber: string, callback: (data: any) => void) => void;
}

export type Props = PickListProps & StateProps & OwnProps & DispatchProps;
