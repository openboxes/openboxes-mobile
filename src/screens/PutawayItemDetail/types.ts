import PutAwayItems from '../../data/putaway/PutAwayItems';
import BinLocation from '../../data/picklist/BinLocation';
import PutAway from '../../data/putaway/PutAway';

export interface State {
  error: string | null;

  putAway: PutAway | null;
  putAwayItem: PutAwayItems | null;
  orderId: string | null;
  binLocationSearchQuery: string | null;
  binLocation: BinLocation | null;
  quantityPicked: string | '0';
}

export interface PutawayItemProps {
  exit: () => void;
  putAway: PutAway | null;
  putAwayItem: PutAwayItems | null;
}
export interface OwnProps {
  navigation: any;
  route: any;
}

export interface StateProps {}

export interface DispatchProps {
  showScreenLoading: (message?: string) => void;
  hideScreenLoading: () => void;
  searchLocationByLocationNumber: (
    locationNumber: string,
    callback: (data: any) => void
  ) => void;
  submitPutawayItem: (
    id: string,
    requestBody: any,
    callback: (data: any) => void
  ) => void;
}

export type Props = PutawayItemProps & StateProps & DispatchProps & OwnProps;
