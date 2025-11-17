import Product from '../../data/product/Product';

export type AllocationOrderLine = {
  product: Product;
  quantityRequired: number;
};

export type AllocationOrder = {
  orderNumber: string;
  name: string;
  orderLines: Array<AllocationOrderLine>;
  orderDate: string;
};
