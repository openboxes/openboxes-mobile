import { Container } from '../data/container/Shipment';
import Location from '../data/location/Location';
import InventoryItem from '../data/picklist/InventoryItem';
import Person from '../data/picklist/Person';
import Product from '../data/product/Product';

// TODO(API): align with the replenishment task API once it is available. The shape mirrors PickTask (types/picking.ts).

export enum ReplenishmentTaskStatus {
  PENDING = 'PENDING',
  PICKING = 'PICKING',
  PICKED = 'PICKED',
  STAGED = 'STAGED'
}

/** A replenishment list (a TRANSFER_ORDER with an R- number) as shown on the list screen */
export type ReplenishmentList = {
  id: string;
  orderNumber: string;
  status: string;
  dateCreated: string;
  tasksCount: number;
};

export type ReplenishmentTask = {
  id: string;
  identifier: string;

  orderId: string;
  orderNumber: string;
  orderStatus: string;
  orderType: string;

  facility?: Location;
  /** The location to pick from */
  location?: Location;
  /** The display location to replenish */
  destinationLocation?: Location | null;
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
  status: ReplenishmentTaskStatus;

  dateRequested?: string | null;
  dateAssigned?: string | null;
  dateStarted?: string | null;
  datePicked?: string | null;
  dateStaged?: string | null;
  dateCreated: string;
  lastUpdated: string;
};
