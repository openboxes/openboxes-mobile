interface StockTransferItem {
  'product.id': string;
  'inventoryItem.id': string;
  'location.id': string;
  'originBinLocation.id': string;
  'destinationBinLocation.id': string;
  quantity: number;
}

export default StockTransferItem;
