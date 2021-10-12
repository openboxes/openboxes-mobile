import {OrderDetailsVm} from './OrderDetailsVm';
import {Props, State} from './types';

export function orderDetailsVMMapper(
  props: Props,
  state: State,
): OrderDetailsVm {
  return <OrderDetailsVm>{
    header: 'Order Details',
    id: props.order ? props.order.id : '',
    name: props.order ? props.order.name : '',
    description: props.order
      ? props.order.description ?? 'No description provided'
      : '',
    datePicked: props.pickList ? props.pickList.datePicked ?? null : null,
    picker: props.pickList ? props.pickList.picker ?? null : null,
    requisition: props.pickList ? props.pickList.requisition ?? null : '',
    picklistItems: props.pickListItem ? props.pickListItem : [],
  };
}
