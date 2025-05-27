import IconCreateLPN from '../../assets/images/icon_create_lpn.svg';
import IconInventory from '../../assets/images/icon_inventory.svg';
import IconLoading from '../../assets/images/icon_loading.svg';
import IconPacking from '../../assets/images/icon_packing.svg';
import IconPendingPutaways from '../../assets/images/icon_pending_putaways.svg';
import IconPendingTransfers from '../../assets/images/icon_pending_transfers.svg';
import IconPicking from '../../assets/images/icon_picking.svg';
import IconProducts from '../../assets/images/icon_products.svg';
import IconPutawayCandidates from '../../assets/images/icon_putaway_candidates.svg';
import IconReceiving from '../../assets/images/icon_receiving.svg';
import IconScan from '../../assets/images/icon_scan.svg';

const dashboardData = [
  {
    screenName: 'Picking',
    icon: IconPicking,
    navigationScreenName: 'Orders'
  },
  {
    screenName: 'Packing',
    icon: IconPacking,
    navigationScreenName: 'OutboundStockList'
  },
  {
    screenName: 'Loading',
    icon: IconLoading,
    navigationScreenName: 'OutboundLoadingList'
  },
  {
    screenName: 'Receiving',
    icon: IconReceiving,
    navigationScreenName: 'InboundOrderList'
  },
  {
    screenName: 'Putaway Candidates',
    icon: IconPutawayCandidates,
    navigationScreenName: 'PutawayCandidates'
  },
  {
    screenName: 'Pending Putaways',
    icon: IconPendingPutaways,
    navigationScreenName: 'PutawayList'
  },
  {
    screenName: 'Products',
    icon: IconProducts,
    navigationScreenName: 'Products'
  },
  {
    screenName: 'Inventory',
    icon: IconInventory,
    navigationScreenName: 'Product Summary'
  },
  {
    screenName: 'Create LPN',
    icon: IconCreateLPN,
    navigationScreenName: 'CreateLpn'
  },
  {
    screenName: 'Transfers',
    icon: IconPendingTransfers,
    navigationScreenName: 'Transfers'
  },
  {
    screenName: 'Scan',
    icon: IconScan,
    navigationScreenName: 'Scan'
  }
];

export default dashboardData;
