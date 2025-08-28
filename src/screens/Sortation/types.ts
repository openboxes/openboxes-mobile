/* eslint-disable no-undef */
import { Container } from '../../data/container/Shipment';
import LocationType from '../../data/location/LocationType';
import PutAwayItems from '../../data/putaway/PutAwayItems';

export type SortationProduct = {
  active: boolean;
  category: string;
  color: string | null;
  dateCreated: string;
  description: string;
  displayNames: {
    default: string | null;
  };
  handlingIcons: unknown[];
  id: string;
  lastUpdated: string;
  lotAndExpiryControl: boolean;
  name: string;
  pricePerUnit: number;
  productCode: string;
  unitOfMeasure: string;
  updatedBy: string;
};

export type SortationFacility = {
  active: boolean;
  id: string;
  locationNumber: string;
  locationType: LocationType;
  locationTypeCode: string;
  name: string;
};

export type SortationLocation = {
  active: boolean;
  id: string;
  locationNumber: string;
  locationType: LocationType;
  locationTypeCode: string;
  name: string;
  zoneId: string | null;
  zoneName: string | null;
};

export type SortationInventoryItem = {
  expirationDate: string;
  id: string;
  lotNumber: string;
  product: SortationProduct;
};

export type SortationPutaway = {
  dateCreated: string;
  destination: unknown;
  errors: unknown;
  id: string;
  orderedBy: unknown;
  origin: unknown;
  putawayAssignee: unknown;
  putawayDate: string | null;
  putawayItems: PutAwayItems[];
  putawayNumber: string;
  putawayStatus: string;
  sortBy: string | null;
};

export type SortationTask = {
  container: Container;
  destination: SortationLocation;
  facility: SortationFacility;
  id: string;
  inventoryItem: SortationInventoryItem;
  location: SortationLocation;
  putaway: SortationPutaway | null;
  quantity: number;
  status: string;
};
