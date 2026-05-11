import { EMPTY_FALLBACK } from '../../constants';

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
