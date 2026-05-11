export type StockTransferCandidate = {
  productAvailabilityId: string;
  product: { id: string; productCode: string; name: string };
  inventoryItem: { id: string };
  originBinLocation: { id: string; name: string; locationNumber?: string };
  originZone?: string | null;
  lotNumber: string | null;
  expirationDate: string | null;
  quantityOnHand: number;
  /** QoH minus already-allocated picks — the transferable amount. */
  quantityNotPicked: number;
};

export type SelectedInventoryItem = {
  inventoryItemId: string;
  productAvailabilityId: string;
  product: { id: string; productCode: string; name: string };
  originBinLocation: { id: string; name: string; locationNumber?: string };
  lotNumber: string | null;
  expirationDate: string | null;
  quantityOnHand: number;
  quantityNotPicked: number;
};

export type DestinationBin = {
  id: string;
  name: string;
  locationNumber?: string;
};

export type BarcodeLookupResult =
  | { kind: 'product'; product: { id: string; productCode: string; name: string } }
  | { kind: 'location'; location: { id: string; name: string; locationNumber?: string } }
  | { kind: 'none' };

export type StockTransferPayloadItem = {
  id: string | null;
  productAvailabilityId: string;
  product: { id: string };
  inventoryItem: { id: string };
  originBinLocation: { id: string };
  destinationBinLocation: { id: string };
  quantity: number;
  quantityOnHand: number;
  quantityNotPicked: number;
  status: 'PENDING' | 'COMPLETED';
  splitItems: StockTransferPayloadItem[];
  sortOrder: number;
};

export type StockTransferPayload = {
  stockTransferItems: StockTransferPayloadItem[];
};

export type CreateTransferStackParams = {
  CreateTransferEntry: undefined;
  CreateTransferItemList: {
    productId?: string;
    productCode?: string;
    binId?: string;
    binName?: string;
    searchTerm?: string;
  };
  CreateTransferQuantity: {
    item: SelectedInventoryItem;
  };
  CreateTransferDestination: {
    item: SelectedInventoryItem;
    quantity: number;
  };
  CreateTransferComplete: {
    transferId: string;
    stockTransferNumber: string;
    item: SelectedInventoryItem;
    quantity: number;
    destination: DestinationBin;
  };
};
