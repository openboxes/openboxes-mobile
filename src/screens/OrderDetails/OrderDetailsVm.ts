import Person from '../../data/picklist/Person';
import Requisition from '../../data/picklist/Requisition';
import { Item } from '../../data/picklist/Item';
import Location from '../../data/order/Location';

export interface OrderDetailsVm {
  header: string;
  id: string;
  identifier: string;
  name: string;
  status: string;
  description: string;
  picker: Person;
  datePicked: Date;
  requisition: Requisition;
  origin: Location;
  destination: Location;
  picklistItems: Item[];
  requestedDeliveryDate: Date;
  expectedShippingDate: Date;
  packingLocation: Location | null;
  loadingLocation: Location | null;
}
