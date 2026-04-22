import { Order } from '../../data/order/Order';

export interface OwnProps {
  exit: () => void;
  navigation: any;
  route: any;
}

export interface DispatchProps {
  getOrdersAction: (value: string | null, callback: (data: any) => void, suppressLoading?: boolean) => void;
}

export type Props = OwnProps & DispatchProps;

export interface State {
  allOrders: Order[] | null;
  loading: boolean;
  searchTerm: string;
}
