import Product from '../product/Product';

interface InventoryItem {
  id: string | null;
  product: Product | null;
  lotNumber: string;
  expirationDate: Date;
}

export default InventoryItem;
