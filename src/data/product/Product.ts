import { ProductCategory } from './category/ProductCategory';
import { ProductAvailability } from './availability/ProductAvailability';
import { Attributes } from './Attributes';
import { ProductType } from './ProductType';
import { ProductImage } from './ProductImage';

interface Product {
  id: string;
  productCode: string;
  name: string;
  description?: string | null;
  pricePerUnit?: number | 0.0;
  category: ProductCategory;
  availability: ProductAvailability;
  attributes: Attributes[];
  productType: ProductType;
  images: ProductImage[];
  quantityAllocated: number;
  quantityAvailableToPromise: number;
  quantityOnHand: number;
  quantityOnOrder: number;
  status?: string;
  unitOfMeasure: string;
  image?: any;
  availableItems: any;
}

export default Product;
