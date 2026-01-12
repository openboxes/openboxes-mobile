/* eslint-disable no-undef */
import LocationType from '../data/location/LocationType';
import InventoryItem from '../data/picklist/InventoryItem';
import Person from '../data/picklist/Person';

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

export type SortationUser = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
};

export type SortationTask = {
  assignee: SortationUser | null;
  container: SortationLocation | null;
  dateCanceled: string | null;
  dateCompleted: string | null;
  dateCreated: string;
  dateStarted: string | null;
  destination: SortationLocation;
  facility: SortationFacility;
  id: string;
  identifier: string;
  inventoryItem: SortationInventoryItem;
  lastUpdated: string;
  location: SortationLocation;
  orderedBy: Person;
  quantity: number;
  status: string;
  type: string;
};

export type DetailChip = {
  icon: string;
  label: string;
  value: string | null | number | undefined;
};

export type PutawayDetailsModel = {
  id: string;
  type: string;
  status: string;
  identifier: string;
  inventoryItem: InventoryItem;
  facility: SortationFacility;
  location: SortationLocation;
  quantity: number;
  container: SortationLocation;
  destination: SortationLocation;
};

export type SortationPutawayScreenType = {
  taskList: PutawayDetailsModel[];
  currentTaskIndex: number;
  isDirectPutaway?: boolean;
};
