export interface PutawayCandidate {
  id?: string | null;
  putawayStatus?: string;
  quantity: number;
  'currentLocation.id'?: string;
  'currentLocation.name'?: string;
  'product.productCode'?: string;
  'product.name'?: string;
  'inventoryItem.lotNumber'?: string | null;
  'inventoryItem.expirationDate'?: string | null;
  [key: string]: any;
}
