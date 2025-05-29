import Location from '../../data/order/Location';
import { Item } from '../../data/picklist/Item';
import Person from '../../data/picklist/Person';
import Requisition from '../../data/picklist/Requisition';

export interface OrderDetailsVm {
  header: string;
  id: string;
  identifier: string;
  name: string;
  status: string;
  description: string;
  pickedBy: Person;
  datePicked: Date;
  requisition: Requisition;
  origin: Location;
  destination: Location;
  picklistItems: Item[];
  requestedDeliveryDate: string;
  expectedShippingDate: string;
  packingLocation: Location | null;
  loadingLocation: Location | null;
}
