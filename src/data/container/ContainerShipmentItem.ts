import Person from '../picklist/Person';
import { Container } from './Container';
import Product from '../product/Product';
import InventoryItem from '../picklist/InventoryItem';
import { Shipment } from './Shipment';

export interface ContainerShipmentItem {
  id: string;
  inventoryItem: InventoryItem;
  quantity: number;
  recipient: Person;
  shipment: Shipment;
  container: Container;
}
