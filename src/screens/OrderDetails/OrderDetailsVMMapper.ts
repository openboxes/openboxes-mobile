import {OrderDetailsVm} from './OrderDetailsVm';
import {Props, State} from './types';

export function orderDetailsVMMapper(
  props: Props,
  state: State,
): OrderDetailsVm {
  return <OrderDetailsVm>{
    header: "Order Details",
    id: props.order ? props.order.id : "",
    identifier: props.order ? props.order.identifier : "",
    name: props.order ? props.order.name : "",
    status: props.order ? props.order.statusCode : "",
    description: props.order ? props.order.description ?? "No description provided" : "",
    origin: props.order ? props.order.origin : null,
    destination: props.order ? props.order.destination : null,
    requestedDeliveryDate: props.order ? props.order.requestedDeliveryDate : null,
    expectedShippingDate: props.order ? props.order.expectedShippingDate : null,
    packingLocation: props.order ? props.order.packingLocation : null,
    loadingLocation: props.order ? props.order.loadingLocation : null,
    datePicked: props.pickList ? props.pickList.datePicked ?? null : null,
    picker: props.pickList ? props.pickList.picker ?? null : null,
    requisition: props.pickList ? props.pickList.requisition ?? null : "",
    picklistItems: props.pickListItem ? props.pickListItem : [],
  };
}
