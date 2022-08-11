import PutAway from '../../data/putaway/PutAway';

export interface State {
  error: string | null;
  putAwayList: PutAway[] | null;
  putAwayListFiltered: PutAway[] | null;
  putAway: PutAway | null;
  orderId: string | null;
  showList: boolean;
  showDetail: boolean;
  lpnFilter: string | null;
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
  showScreenLoading: (message?: string) => void;
  hideScreenLoading: () => void;
  getOrdersAction: (orderNumber: string, callback: (data: any) => void) => void;
  fetchPutAwayFromOrderAction: (q: string | null, callback: (data: any) => void) => void;
}

export type Props = OwnProps & StateProps & DispatchProps;
