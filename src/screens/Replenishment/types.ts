import { Container } from '../../data/container/Shipment';
import Location from '../../data/location/Location';
import InventoryItem from '../../data/picklist/InventoryItem';
import Product from '../../data/product/Product';

export enum ReplenishmentTaskStatus {
  PENDING = 'PENDING',
  PICKING = 'PICKING',
  PICKED = 'PICKED',
  STAGED = 'STAGED'
}

export type ReplenishmentTask = {
  id: string;
  identifier: string;

  orderId: string;
  orderNumber: string;
  orderStatus: string;
  orderType: string;

  facility?: Location;
  location?: Location;
  outboundContainer?: Container | null;
  stagingLocation?: Location | null;

  product: Product;
  inventoryItem: InventoryItem;

  quantityRequired: number;
  quantityPicked: number;

  requestedBy?: string | null;
  assignee?: string | null;
  pickedBy?: string | null;
  stagedBy?: string | null;

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
