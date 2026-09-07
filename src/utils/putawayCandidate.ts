export function putawayCandidateKey(source: any): string {
  return [source?.['currentLocation.id'], source?.['inventoryItem.id'], source?.['product.id']].join(':');
}
