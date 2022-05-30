import { Shipment } from '../../data/container/Shipment';

export interface State {
  error: string | null;
  shipments: Shipment[];
  filteredShipments: Shipment[];
}

export interface OwnProps {
  exit: () => void;
  navigation: any;
}

export interface StateProps {
  outboundStockList: any;
  currentLocation: any;
}

export interface DispatchProps {
  showScreenLoading: (message?: string) => void;
  hideScreenLoading: () => void;
  getShipmentsReadyToBePacked: (
    locationId: string,
    shipmentStatusCode: string,
    callback: (data: any) => void
  ) => void;
}

export type Props = OwnProps & StateProps & DispatchProps;
