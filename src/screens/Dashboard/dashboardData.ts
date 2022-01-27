const dashboardData = [
  {
    screenName: 'Picking',
    icon: require('../../assets/images/picking.png'),
    navigationScreenName: 'Orders',
  },
  {
    screenName: 'Packing',
    icon: require('../../assets/images/packing.png'),
    navigationScreenName: 'OutboundStockList',
  },
  {
    screenName: 'Loading',
    icon: require('../../assets/images/loading.png'),
    navigationScreenName: 'OutboundStockList',
  },
  {
    screenName: 'Receiving',
    icon: require('../../assets/images/receiving.png'),
    navigationScreenName: 'InboundOrderList',
  },
  {
    screenName: 'Putaway Candidates',
    icon: require('../../assets/images/putaway.png'),
    navigationScreenName: 'PutawayCandidates',
  },
  {
    screenName: 'Pending Putaways',
    icon: require('../../assets/images/putaway.png'),
    navigationScreenName: 'PutawayList',
  },
  {
    screenName: 'Products',
    icon: require('../../assets/images/product.png'),
    navigationScreenName: 'Products',
  },
  {
    screenName: 'Inventory',
    icon: require('../../assets/images/inventory.png'),
    navigationScreenName: 'Product Summary',
  },
  {
    screenName: 'Create LPN',
    icon: require('../../assets/images/lookup.png'),
    navigationScreenName: 'CreateLpn',
  },
  {
    screenName: 'Pending Transfers',
    icon: require('../../assets/images/transfer.png'),
    navigationScreenName: 'Transfers',
  },
  {
    screenName: 'Scan',
    icon: require('../../assets/images/scan.jpg'),
    navigationScreenName: 'Scan',
  },
];

export default dashboardData;
