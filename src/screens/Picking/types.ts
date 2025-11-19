import Location from '../../data/location/Location';
import Product from '../../data/product/Product';

type PickTypePriority = 1 | 2 | 3 | 4 | undefined;

export type PickType = {
  priority: PickTypePriority;
  label: string;
};

// TODO: Adjust PickTask type as needed
export type PickTask = {
  id: string;
  product: Product;
  destination: Location;
  quantityToPick: number;
  status: string;
};
