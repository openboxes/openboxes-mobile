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
  loading: boolean;
  searchTerm: string;
}

export interface OwnProps {
  exit: () => void;
  orderId: string;
  navigation: any;
}

export interface StateProps {
  putAway: any;
  productSummaryConfig: { [key: string]: boolean };
}

export interface DispatchProps {
  getOrdersAction: (orderNumber: string, callback: (data: any) => void) => void;
  fetchPutAwayFromOrderAction: (q: string | null, callback: (data: any) => void, suppressLoading?: boolean) => void;
}

export type Props = OwnProps & StateProps & DispatchProps;
