import Location from '../../data/location/Location';
import Product from '../../data/product/Product';

export type AvailableItem = {
  _localId: string;
  'inventoryItem.id': string;
  binLocation: Location;
  quantityAvailable: number;
  quantityAllocated: string;
};

export type AllocationOrderLine = {
  id: string;
  product: Product;
  quantityRequired: number;
  quantityAllocated: number;
  availableItems: Array<AvailableItem>;
  allocationStatus: AllocationStatus;
};

export type AllocationOrder = {
  id: string;
  name: string;
  identifier: string;
  lineItemCount: number;
  dateTimeCreated: string;
};

export type AllocationStrategy = 'WAREHOUSE_FIRST' | 'DISPLAY_FIRST';

export type AllocationStatus = 'ALLOCATED' | 'PARTIALLY_ALLOCATED' | 'UNALLOCATED';
