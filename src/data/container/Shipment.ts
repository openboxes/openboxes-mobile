import ShipmentItems from '../inbound/ShipmentItems';
import { Container } from './Container';
import Location from '../location/Location';

export interface Shipment {
  id: string;
  name: string;
  shipmentNumber: string;
  status: string;
  expectedShippingDate: string;
  actualShippingDate: string;
  expectedDeliveryDate: string;
  actualDeliveryDate: string;
  shippedCount: number;
  receivedCount: number;
  shipmentItems: ShipmentItems[];
  containers: Container[];
  origin: Location;
  destination: Location;
  packingLocation: Location | null;
  loadingLocation: Location | null;
  availableContainers: Container[];
  requisitionStatus: string;
  packingStatus: string;
}

interface ShipmentsReadyToPackedResponse {
  data: Shipment[];
}
export interface ShipmentReadyToPackedResponse {
  data: Shipment;
}

export default ShipmentsReadyToPackedResponse;
