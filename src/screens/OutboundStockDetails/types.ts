import { Shipment } from '../../data/container/Shipment';
import { OutboundVM } from './OutboundVM';

export interface State {
  error: string | null;
  shipment: Shipment | null;
  shipmentData?: OutboundVM | null; // for packing details only | not required for loading details and load LPM
  scannedContainer?: string;
  scannedValue?: string;
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
