import StockTransferItem from './StockTransferItem';

interface Transfer {
  status: string;
  stockTransferNumber: string;
  description: string;
  'origin.id': string;
  'destination.id': string;
  stockTransferItems: StockTransferItem[];
}

export interface StockTransferApiResponse {
  data: Transfer;
}

export default Transfer;
