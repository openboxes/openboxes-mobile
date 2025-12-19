import Location from '../../data/location/Location';
import Product from '../../data/product/Product';

export type AvailableItem = {
  _localId: string;
  'inventoryItem.id': string;
  binLocation: Location;
  quantityAvailable: number;
  quantityPicked: string;
};

export type AllocationOrderLine = {
  id: string;
  product: Product;
  quantityRequired: number;
  availableItems: Array<AvailableItem>;
};

export type AllocationOrder = {
  id: string;
  name: string;
  identifier: string;
  lineItemCount: number;
  dateTimeCreated: string;
};

export type AllocationStrategy = 'WAREHOUSE_PICK' | 'DISPLAY_PICK';