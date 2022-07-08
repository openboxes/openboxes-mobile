import _ from 'lodash';
import { OrderDetailsVm } from './OrderDetailsVm';
import { Props } from './types';

export const orderDetailsVMMapper = (props: Props): OrderDetailsVm => {
  return {
    header: 'Order Details',
    id: _.get(props, 'order.id', ''),
    identifier: _.get(props, 'order.identifier', ''),
    name: _.get(props, 'order.name', ''),
    status: _.get(props, 'order.statusCode', ''),
    statusMessage: _.get(props, 'pickList.statusMessage', ''),
    description: _.get(props, 'order.description', 'No description provided'),
    origin: _.get(props, 'order.origin', null),
    destination: _.get(props, 'order.destination', null),
    requestedDeliveryDate: _.get(props, 'order.requestedDeliveryDate', null),
    expectedShippingDate: _.get(props, 'order.expectedShippingDate', null),
    packingLocation: _.get(props, 'order.packingLocation', null),
    loadingLocation: _.get(props, 'order.loadingLocation', null),
    datePicked: _.get(props, 'order.pickList.pickList', null),
    picker: _.get(props, 'order.pickList.picker', null),
    requisition: _.get(props, 'order.pickList.requisition', ''),
    picklistItems: _.get(props, 'order.picklistItems', [])
  };
};
