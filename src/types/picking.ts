import { Container } from '../data/container/Shipment';
import Location from '../data/location/Location';
import InventoryItem from '../data/picklist/InventoryItem';
import Person from '../data/picklist/Person';
import Product from '../data/product/Product';

export type ReasonCode = {
  id: string;
  name: string;
};

export enum DeliveryTypeCode {
  PICK_UP = 'PICK_UP',
  LOCAL_DELIVERY = 'LOCAL_DELIVERY',
  SERVICE = 'SERVICE',
  WILL_CALL = 'WILL_CALL',
  SHIP_TO = 'SHIP_TO',
  DEFAULT = 'DEFAULT'
}

export enum PickTaskStatus {
  PENDING = 'PENDING',
  PICKING = 'PICKING',
  PICKED = 'PICKED',
  STAGED = 'STAGED'
}

export type PickTask = {
  id: string;
  identifier: string;

  requisitionId?: string;
  requisitionNumber?: string;
  requisitionStatus?: string;
  requisitionType?: string;

  deliveryTypeCode?: DeliveryTypeCode;

  facility?: Location;
  location?: Location;
  outboundContainer?: Container | null;
  stagingLocation?: Location | null;

  product: Product;
  inventoryItem: InventoryItem;

  quantityRequired: number;
  quantityPicked: number;

  requestedBy?: string | null;
  assignee?: Person | null;
  pickedBy?: Person | null;
  stagedBy?: Person | null;

  priority?: number;
  reasonCode?: string | null;
  status: PickTaskStatus;

  dateRequested?: string | null;
  dateAssigned?: string | null;
  dateStarted?: string | null;
  datePicked?: string | null;
  dateStaged?: string | null;
  dateCreated: string;
  lastUpdated: string;
};

export type DeliveryType = {
  priority: number;
  label: string;
  code: DeliveryTypeCode;
};
