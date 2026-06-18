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
  STOCK_TRANSFER_IBT = 'STOCK_TRANSFER_IBT',
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
  requisitionItemId?: string;
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

export type DeliveryTypeOrderCount = {
  deliveryTypeCode: DeliveryTypeCode;
  availableCount: number;
  totalCount: number;
};

export type AvailableItem = {
  'inventoryItem.id': string | null;
  'product.name': string | null;
  product: Product;
  productCode: string | null;
  lotNumber: string | null;
  expirationDate: string | null;
  'binLocation.id': string | null;
  'binLocation.name': string | null;
  binLocation: Location | null;
  quantityAvailable: number;
  quantityOnHand: number;
  status: string;
  pickedRequisitionNumbers: string;
};

export type PicklistItem = {
  id: string;
  status: string | null;
  'requisitionItem.id': string | null;
  'inventoryItem.id': string | null;
  'binLocation.id': string | null;
  'binLocation.name': string | null;
  'binLocation.zoneName': string | null;
  'binLocation.locationNumber': string | null;
  quantity: number;
  quantityPicked: number;
  quantityToPick: number;
  quantityRemaining: number;
  reasonCode: string | null;
  lotNumber: string | null;
  expirationDate: string | null;
};

export type PickPageItem = {
  'requisitionItem.id': string;
  productCode: string;
  productId: string;
  product: Product;
  quantityRequired: number;
  quantityAllocated: number;
  quantityPicked: number;
  quantityAvailable: number | null;
  quantityRemaining: number;
  availableItems: AvailableItem[];
  picklistItems: PicklistItem[];
  reasonCode: string | null;
  pickStatusCode: string;
  requestStatusCode: string;
};

export type ReallocationItem = AvailableItem & {
  _localId: string;
  id?: string;
  quantityAllocated: string;
  quantityPicked: string;
};

export type ReallocatePicklistItem = {
  inventoryItem: { id: string };
  binLocation: { id: string };
  quantity: number;
};
