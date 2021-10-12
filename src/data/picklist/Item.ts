import Product from '../product/Product';
import BinLocation from './BinLocation';

export interface Item {
  id: String;
  status: String;
  productCode: String;
  product: Product;
  lotNumber: String;
  expirationDate: Date;
  quantityPicked: number;
  quantityRequired: number;
  reasonCode: String;
  comment: String;
  binLocation: BinLocation;
}

export default interface GetPickListApiResponse {
  data: Item[];
};
