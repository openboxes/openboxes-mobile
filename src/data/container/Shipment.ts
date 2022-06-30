import ShipmentItems from '../inbound/ShipmentItems';
import { Container } from './Container';
import Location from '../location/Location';

export interface PackingStatusDetails {
  statusMessage: string;
  packedItemCount: number;
  totalItemCount: number;
  packingLocation: Location;
}

export interface LoadingStatusDetails {
  statusMessage: string;
  loadedContainerCount: number;
  totalContainerCount: number;
  emptyContainerCount: number;
  loadingLocation: Location;
}

export interface Shipment {
  id: string;
  name: string;
  shipmentNumber: string;
  status: string;
  requisitionStatus: string;
  origin: Location;
  destination: Location;
  expectedShippingDate: string;
  actualShippingDate: string;
  expectedDeliveryDate: string;
  actualDeliveryDate: string;

  packingLocation: string;
  packingStatus: string;
  packingStatusDetails: PackingStatusDetails;

  loadingLocation: string;
  loadingStatus: string;
  loadingStatusDetails: LoadingStatusDetails;

  // shipment item status
  totalItemCount: number;
  unpackedItemCount: number;
  shippedItemCount: number;
  receivedItemCount: number;

  // container status
  loadedContainerCount: number;
  packedContainerCount: number;
  totalContainerCount: number;

  // associations
  shipmentItems: ShipmentItems[];
  containers: Container[];
  availableContainers: Container[];
}

interface ShipmentsReadyToPackedResponse {
  data: Shipment[];
}
export interface ShipmentReadyToPackedResponse {
  data: Shipment;
}

export default ShipmentsReadyToPackedResponse;
