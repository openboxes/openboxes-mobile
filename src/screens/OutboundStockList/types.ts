import { Shipment } from '../../data/container/Shipment';

export interface State {
  error: string | null;
  shipments: Shipment[];
  filteredShipments: Shipment[];
  loading: boolean;
  searchTerm: string;
}

export interface OwnProps {
  exit: () => void;
  navigation: any;
}

export interface StateProps {
  currentLocation: any;
}

export interface DispatchProps {
  getShipmentsReadyToBePacked: (
    locationId: string,
    shipmentStatusCode: string,
    callback: (data: any) => void,
    suppressLoading?: boolean
  ) => void;
}

export type Props = OwnProps & StateProps & DispatchProps;
