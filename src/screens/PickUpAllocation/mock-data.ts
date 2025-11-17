import { AllocationOrder } from './types';

const MOCKED_PRODUCTS = [
  {
    id: 'P-001',
    productCode: 'SKU-1001',
    name: 'Wireless Mouse',
    category: {
      id: 'C-01',
      name: 'Electronics'
    },
    availability: {
      quantityOnHand: {
        value: 90,
        unitOfMeasure: {
          code: 'pcs',
          name: 'pieces'
        }
      },
      quantityAvailableToPromise: {
        value: 75,
        unitOfMeasure: {
          code: 'pcs',
          name: 'pieces'
        }
      },
      quantityAllocated: {
        value: 15,
        unitOfMeasure: {
          code: 'pcs',
          name: 'pieces'
        }
      },
      quantityOnOrder: {
        value: 30,
        unitOfMeasure: {
          code: 'pcs',
          name: 'pieces'
        }
      }
    },
    attributes: [],
    productType: {
      name: 'Standard'
    },
    images: [],
    description: 'High-precision wireless mouse with ergonomic design.',
    pricePerUnit: 25.99,
    quantityAllocated: 15,
    quantityAvailableToPromise: 75,
    quantityOnHand: 90,
    quantityOnOrder: 30,
    unitOfMeasure: 'pcs',
    availableItems: []
  },
  {
    id: 'P-002',
    productCode: 'SKU-2002',
    name: 'Bluetooth Keyboard',
    category: {
      id: 'C-01',
      name: 'Electronics'
    },
    availability: {
      quantityOnHand: {
        value: 70,
        unitOfMeasure: {
          code: 'pcs',
          name: 'pieces'
        }
      },
      quantityAvailableToPromise: {
        value: 60,
        unitOfMeasure: {
          code: 'pcs',
          name: 'pieces'
        }
      },
      quantityAllocated: {
        value: 10,
        unitOfMeasure: {
          code: 'pcs',
          name: 'pieces'
        }
      },
      quantityOnOrder: {
        value: 20,
        unitOfMeasure: {
          code: 'pcs',
          name: 'pieces'
        }
      }
    },
    attributes: [],
    productType: {
      name: 'Standard'
    },
    images: [],
    description: 'Compact Bluetooth keyboard suitable for tablets and laptops.',
    pricePerUnit: 45.0,
    quantityAllocated: 10,
    quantityAvailableToPromise: 60,
    quantityOnHand: 70,
    quantityOnOrder: 20,
    unitOfMeasure: 'pcs',
    availableItems: []
  }
];

export const MOCKED_ORDERS: AllocationOrder[] = [
  {
    orderNumber: 'ORD-001',
    name: 'Frank Lee',
    orderLines: [
      { product: MOCKED_PRODUCTS[0], quantityRequired: 10 },
      { product: MOCKED_PRODUCTS[1], quantityRequired: 5 },
      { product: MOCKED_PRODUCTS[1], quantityRequired: 3 },
      { product: MOCKED_PRODUCTS[1], quantityRequired: 5 },
      { product: MOCKED_PRODUCTS[1], quantityRequired: 4 },
      { product: MOCKED_PRODUCTS[1], quantityRequired: 2 },
      { product: MOCKED_PRODUCTS[1], quantityRequired: 1 },
      { product: MOCKED_PRODUCTS[1], quantityRequired: 8 }
    ],
    orderDate: '2026-06-15T10:30:00Z'
  },
  {
    orderNumber: 'ORD-002',
    name: 'Grace Kim',
    orderLines: [{ product: MOCKED_PRODUCTS[1], quantityRequired: 8 }],
    orderDate: '2026-06-14T14:45:00Z'
  },
  {
    orderNumber: 'ORD-003',
    name: 'Hannah Scott',
    orderLines: [
      { product: MOCKED_PRODUCTS[0], quantityRequired: 4 },
      { product: MOCKED_PRODUCTS[1], quantityRequired: 4 }
    ],
    orderDate: '2026-06-13T09:15:00Z'
  },
  {
    orderNumber: 'ORD-004',
    name: 'Ian Wright',
    orderLines: [{ product: MOCKED_PRODUCTS[0], quantityRequired: 12 }],
    orderDate: '2026-06-12T16:00:00Z'
  },
  {
    orderNumber: 'ORD-005',
    name: 'Jane Foster',
    orderLines: [{ product: MOCKED_PRODUCTS[1], quantityRequired: 7 }],
    orderDate: '2026-06-11T11:20:00Z'
  }
];
