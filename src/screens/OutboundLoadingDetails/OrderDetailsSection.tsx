import React from 'react';
import { Shipment } from '../../data/container/Shipment';
import DetailsTable from '../../components/DetailsTable';

interface Props {
  shipment: Shipment | null;
}

const OrderDetailsSection = (props: Props) => (
  <DetailsTable
    data={[
      { label: 'Shipment Number', value: props?.shipment?.shipmentNumber },
      {
        label: 'Status',
        value: `${props?.shipment?.displayStatus} (${props?.shipment?.loadingStatusDetails?.statusMessage} containers)`
      },
      { label: 'Destination', value: props?.shipment?.destination.name },
      { label: 'Expected Shipping Date', value: props?.shipment?.expectedShippingDate },
      { label: 'Loading Location', value: props?.shipment?.loadingLocation },
      { label: 'Expected Delivery Date', value: props?.shipment?.expectedDeliveryDate }
    ]}
  />
);

export default OrderDetailsSection;
