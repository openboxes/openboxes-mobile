import Location from '../../data/location/Location';
import Product from '../../data/product/Product';

export type AvailableItem = {
  _localId: string;
  id?: string;
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
  allocations: Array<AllocationDto>;
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

export type AllocationDto = {
  id?: string;
  inventoryItemId: string;
  binLocationId: string;
  quantity: number;
};
