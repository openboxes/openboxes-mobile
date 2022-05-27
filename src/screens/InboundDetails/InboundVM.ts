import ShipmentItems from '../../data/inbound/ShipmentItems';

export interface InboundVM {
  header: string;
  shipmentId: string;
  sectionData: SectionData[] | [];
}

export interface SectionData {
  title: string;
  data: ShipmentItems[];
}
