import { Order } from '../../data/order/Order';

export interface OwnProps {
  exit: () => void;
  navigation: any;
  route: any;
}

export interface DispatchProps {
  showScreenLoading: (message?: string) => void;
  hideScreenLoading: () => void;
  getOrdersAction: (
    value: string | null,
    callback: (data: any) => void
  ) => void;
}

export type Props = OwnProps & DispatchProps;

export interface State {
  error: string | null;
  allOrders: Order[] | null;
  resultCount: Number;
}

export interface OrderListProps {
  orders: Order[] | null;
  onOrderTapped: (order: Order) => void;
}
