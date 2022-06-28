import { Shipment } from '../../data/container/Shipment';
import { OutboundVM } from './OutboundVM';

export interface State {
  error: string | null;
  shipment: Shipment | null;
  shipmentData: OutboundVM | null;
}

export interface OwnProps {
  exit: () => void;
  navigation: any;
  route: any;
}

export interface StateProps {
  outboundStockList: any;
  currentLocation: any;
}

export interface DispatchProps {
  showScreenLoading: (message?: string) => void;
  hideScreenLoading: () => void;
  getShipment: (
    id: string,
    callback: (data: any) => void
  ) => void;
}

export interface OutboundDetailOwnProps {
  containers: any;
}

export type Props = OwnProps & StateProps & DispatchProps;
