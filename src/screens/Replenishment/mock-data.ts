export const DUMMY_REPLENISHMENT = {
  id: 'rep-001',
  product: {
    id: 'prod-001',
    productCode: 'PROD-001',
    name: 'Sample Product'
  }
};

export const DUMMY_REPLENISHMENT_TASKS = [
  {
    id: 'task-001',
    location: {
      id: 'loc-001',
      locationNumber: 'LOC-001',
      name: 'Sample Location'
    },
    quantityPicked: 0,
    quantityRequired: 10,
    product: {
      id: 'prod-001',
      productCode: 'PROD-001',
      name: 'Sample Product'
    },
    replenishment: DUMMY_REPLENISHMENT,
    outboundContainer: {
      id: 'container-001',
      locationNumber: 'CONT-001',
      name: 'Outbound Container 1'
    }
  }
];
