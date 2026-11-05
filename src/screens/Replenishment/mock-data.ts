// TODO(API): remove once the replenishment task API is available (see USE_REPLENISHMENT_MOCKS in apis/replenishment.ts)
import { Container } from '../../data/container/Shipment';
import Location from '../../data/location/Location';
import InventoryItem from '../../data/picklist/InventoryItem';
import Product from '../../data/product/Product';
import { ReplenishmentList, ReplenishmentTask, ReplenishmentTaskStatus } from '../../types/replenishment';

const DATE_CREATED = '2026-11-04T06:00:00Z';

function mockLocation(id: string, locationNumber: string, name: string, isDisplay = false): Location {
  return { id, locationNumber, name, isDisplay } as Location;
}

function mockProduct(id: string, productCode: string, name: string): Product {
  return { id, productCode, name } as Product;
}

function mockInventoryItem(id: string, product: Product, lotNumber: string, expirationDate: string): InventoryItem {
  return { id, product, lotNumber, expirationDate: new Date(expirationDate) };
}

const FACILITY = mockLocation('facility-001', 'MAIN', 'Main Warehouse');

const PRODUCTS = {
  gloves: mockProduct('prod-001', '10001', 'Examination gloves, nitrile, medium'),
  syringe: mockProduct('prod-002', '10002', 'Syringe, 5 ml, luer lock'),
  gauze: mockProduct('prod-003', '10003', 'Gauze swab, 10 x 10 cm, sterile'),
  bandage: mockProduct('prod-004', '10004', 'Elastic bandage, 10 cm'),
  mask: mockProduct('prod-005', '10005', 'Surgical mask, type IIR')
};

type MockTaskInput = {
  id: string;
  list: ReplenishmentList;
  product: Product;
  lotNumber: string;
  expirationDate: string;
  location: Location;
  destinationLocation: Location;
  quantityRequired: number;
};

function mockTask({
  id,
  list,
  product,
  lotNumber,
  expirationDate,
  location,
  destinationLocation,
  quantityRequired
}: MockTaskInput): ReplenishmentTask {
  return {
    id,
    identifier: id.toUpperCase(),
    orderId: list.id,
    orderNumber: list.orderNumber,
    orderStatus: list.status,
    orderType: 'TRANSFER_ORDER',
    facility: FACILITY,
    location,
    destinationLocation,
    outboundContainer: null,
    stagingLocation: null,
    product,
    inventoryItem: mockInventoryItem(`ii-${id}`, product, lotNumber, expirationDate),
    quantityRequired,
    quantityPicked: 0,
    status: ReplenishmentTaskStatus.PENDING,
    dateCreated: DATE_CREATED,
    lastUpdated: DATE_CREATED
  };
}

export const MOCK_REPLENISHMENT_LISTS: ReplenishmentList[] = [
  { id: 'order-001', orderNumber: 'R-1001', status: 'PLACED', dateCreated: DATE_CREATED, tasksCount: 4 },
  { id: 'order-002', orderNumber: 'R-1002', status: 'PLACED', dateCreated: DATE_CREATED, tasksCount: 3 }
];

const [LIST_1, LIST_2] = MOCK_REPLENISHMENT_LISTS;

// Deliberately not in location order, to exercise the sequencing by location
export const MOCK_REPLENISHMENT_TASKS: ReplenishmentTask[] = [
  mockTask({
    id: 'task-001',
    list: LIST_1,
    product: PRODUCTS.gloves,
    lotNumber: 'LOT-A1',
    expirationDate: '2027-06-30',
    location: mockLocation('bin-010', 'A-10-1', 'Aisle A, Bay 10, Level 1'),
    destinationLocation: mockLocation('display-001', 'D-01', 'Display 01', true),
    quantityRequired: 40
  }),
  mockTask({
    id: 'task-002',
    list: LIST_1,
    product: PRODUCTS.syringe,
    lotNumber: 'LOT-B7',
    expirationDate: '2028-01-31',
    location: mockLocation('bin-002', 'A-2-1', 'Aisle A, Bay 2, Level 1'),
    destinationLocation: mockLocation('display-002', 'D-02', 'Display 02', true),
    quantityRequired: 25
  }),
  mockTask({
    id: 'task-003',
    list: LIST_1,
    product: PRODUCTS.gauze,
    lotNumber: 'LOT-C3',
    expirationDate: '2027-12-31',
    location: mockLocation('bin-101', 'B-1-1', 'Aisle B, Bay 1, Level 1'),
    destinationLocation: mockLocation('display-003', 'D-03', 'Display 03', true),
    quantityRequired: 60
  }),
  mockTask({
    id: 'task-004',
    list: LIST_1,
    product: PRODUCTS.bandage,
    lotNumber: 'LOT-D9',
    expirationDate: '2029-03-31',
    location: mockLocation('bin-003', 'A-3-2', 'Aisle A, Bay 3, Level 2'),
    destinationLocation: mockLocation('display-001', 'D-01', 'Display 01', true),
    quantityRequired: 12
  }),
  mockTask({
    id: 'task-005',
    list: LIST_2,
    product: PRODUCTS.mask,
    lotNumber: 'LOT-E2',
    expirationDate: '2028-09-30',
    location: mockLocation('bin-205', 'C-5-1', 'Aisle C, Bay 5, Level 1'),
    destinationLocation: mockLocation('display-004', 'D-04', 'Display 04', true),
    quantityRequired: 100
  }),
  mockTask({
    id: 'task-006',
    list: LIST_2,
    product: PRODUCTS.gloves,
    lotNumber: 'LOT-A2',
    expirationDate: '2027-08-31',
    location: mockLocation('bin-011', 'A-11-1', 'Aisle A, Bay 11, Level 1'),
    destinationLocation: mockLocation('display-004', 'D-04', 'Display 04', true),
    quantityRequired: 20
  }),
  mockTask({
    id: 'task-007',
    list: LIST_2,
    product: PRODUCTS.syringe,
    lotNumber: 'LOT-B8',
    expirationDate: '2028-02-29',
    location: mockLocation('bin-102', 'B-2-1', 'Aisle B, Bay 2, Level 1'),
    destinationLocation: mockLocation('display-005', 'D-05', 'Display 05', true),
    quantityRequired: 30
  })
];

/** Containers the mocked API accepts, standing in for locations supporting the OUTBOUND_CONTAINER activity */
export const MOCK_REPLENISHMENT_CONTAINERS: Container[] = ['OUT-0001', 'OUT-0002', 'OUT-0003'].map(
  (locationNumber) => ({ id: `container-${locationNumber}`, locationNumber, name: locationNumber } as Container)
);
