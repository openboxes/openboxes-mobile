import PutAway from '../../data/putaway/PutAway';

export interface State {
  error: string | null;
  transfersList: PutAway[] | null;
  loading: boolean;
}

export interface OwnProps {
  exit: () => void;
  orderId: string;
  navigation: any;
}

export interface StateProps {
  putAway: any;
}

export interface DispatchProps {
  getOrdersAction: (orderNumber: string, callback: (data: any) => void) => void;
  getStockTransfers: (locationId: string, callback: (data: any) => void) => void;
  fetchTransfersList: (q: string | null, callback: (data: any) => void) => void;
}

export type Props = OwnProps & StateProps & DispatchProps;
