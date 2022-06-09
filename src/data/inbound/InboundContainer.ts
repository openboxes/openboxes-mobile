import ShipmentItems from './ShipmentItems';

interface InboundContainer {
  'container.id': string;
  'container.name': string;
  'parentContainer.id': string | null;
  'parentContainer.name': string | null;
  'container.type': string;
  shipmentItems: ShipmentItems[];
}

export default InboundContainer;
