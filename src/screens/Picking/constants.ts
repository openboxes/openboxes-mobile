import { DeliveryType, DeliveryTypeCode } from '../../types/picking';

export const DELIVERY_TYPES: DeliveryType[] = [
  { priority: 1, label: 'Pick Up', code: DeliveryTypeCode.PICK_UP },
  { priority: 2, label: 'Local Delivery', code: DeliveryTypeCode.LOCAL_DELIVERY },
  { priority: 2, label: 'Service', code: DeliveryTypeCode.SERVICE },
  { priority: 3, label: 'Will Call', code: DeliveryTypeCode.WILL_CALL },
  { priority: 3, label: 'Stock Transfer (IBT)', code: DeliveryTypeCode.STOCK_TRANSFER_IBT },
  { priority: 4, label: 'Ship To', code: DeliveryTypeCode.SHIP_TO },
  { priority: 5, label: 'System Directed', code: DeliveryTypeCode.DEFAULT }
];

export const PRIORITY_LABELS: Record<number, string> = {
  1: 'Highest',
  2: 'High',
  3: 'Medium',
  4: 'Low',
  5: 'Lowest'
};
