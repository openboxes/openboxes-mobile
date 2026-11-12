import { EMPTY_FALLBACK } from '../../constants';
import Location from '../../data/location/Location';
import { SelectedInventoryItem, StockTransferCandidate } from './types';

export function isReceivingLocation(location: Pick<Location, 'supportedActivities'>): boolean {
  return location.supportedActivities?.includes('RECEIVE_STOCK') ?? false;
}

export function toSelectedInventoryItem(candidate: StockTransferCandidate): SelectedInventoryItem {
  return {
    inventoryItemId: candidate.inventoryItem.id,
    productAvailabilityId: candidate.productAvailabilityId,
    product: candidate.product,
    originBinLocation: {
      id: candidate.originBinLocation?.id ?? null,
      name: candidate.originBinLocation?.name || 'Default',
      locationNumber: candidate.originBinLocation?.locationNumber
    },
    lotNumber: candidate.lotNumber ?? null,
    expirationDate: candidate.expirationDate ?? null,
    quantityOnHand: candidate.quantityOnHand,
    quantityNotPicked: candidate.quantityNotPicked
  };
}

export function formatLotExpiry(lot: string | null, expiry: string | null): string {
  if (lot && expiry) {
    return `${lot} • Exp ${expiry}`;
  }
  return lot || expiry || EMPTY_FALLBACK;
}

export const STOCK_TRANSFER_STATUS = {
  PENDING: 'PENDING',
  COMPLETED: 'COMPLETED'
} as const;

export type StockTransferStatus = (typeof STOCK_TRANSFER_STATUS)[keyof typeof STOCK_TRANSFER_STATUS];
