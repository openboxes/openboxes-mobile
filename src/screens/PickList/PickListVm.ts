// import Person from '../../data/picklist/Person';
// import Requisition from '../../data/picklist/Requisition';
// import Product from '../../data/product/Product';
// import BinLocation from '../../data/picklist/BinLocation';
import {Item} from '../../data/picklist/Item';
import {Order} from '../../data/order/Order';

export interface PickListVm {
  header: string;
  picklistItems: Item;
  order: Order;
}

// export interface RequisitionVm{
//   id: string
// }
//
// export interface ItemVm{
//   id: string
//   status: string,
//   productCode: string,
//   product: Product,
//   lotNumber: string,
//   expirationDate: Date,
//   quantityPicked: number,
//   reasonCode: string,
//   comment: string
//   binLocation: BinLocationVm
// }
//
// export interface BinLocationVm{
//   id: string,
//   name: string,
//   zoneId: string,
//   zoneName: string
//
// }
