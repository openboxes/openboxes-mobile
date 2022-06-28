import Location from './Location';
import PickList from '../picklist/PickList';
import { PicklistItem } from '../picklist/PicklistItem';

export interface Order {
  id: string;
  name: string;
  shipmentNumber: string;
  description?: string | null;
  identifier?: string | null;
  statusCode?: string | null;
  requestedDeliveryDate?: Date | null;
  expectedShippingDate?: Date | null;
  origin: Location | null;
  destination: Location | null;
  picklist: PicklistItem | null;
  packingLocation: Location | null;
  loadingLocation: Location | null;
}

interface GetOrdersApiResponse {
  data: Order[];
}

export default GetOrdersApiResponse;
