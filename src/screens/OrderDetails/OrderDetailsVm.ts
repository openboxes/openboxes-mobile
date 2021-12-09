<<<<<<< HEAD:app/components/screens/order_details/OrderDetailsVm.ts
import Person from "../../../data/picklist/Person";
import Requisition from "../../../data/picklist/Requisition";
import Product from "../../../data/product/Product";
import BinLocation from "../../../data/picklist/BinLocation";
import Item from "../../../data/picklist/Item";
import Location from "../../../data/order/Location";
=======
import Person from '../../data/picklist/Person';
import Requisition from '../../data/picklist/Requisition';
// import Product from '../../data/product/Product';
// import BinLocation from '../../data/picklist/BinLocation';
import {Item} from '../../data/picklist/Item';
import Location from "../../data/order/Location";
>>>>>>> 066318bb09b5e7fa073028447bd7df3b1737ed16:src/screens/OrderDetails/OrderDetailsVm.ts

export interface OrderDetailsVm {
  header: string
  id: string,
  identifier: string,
  name: string,
  status: string,
  description: string,
  picker: Person,
  datePicked: Date,
  requisition: Requisition
  origin: Location
  destination: Location
  picklistItems: Item[]
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
