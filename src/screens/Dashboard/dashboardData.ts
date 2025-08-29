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
import IconSortation from '../../assets/images/icon_sortation.svg';
import IconPutaway from '../../assets/images/icon_putaway.svg';

export type DashboardEntry = {
  key: string;
  screenName: string;
  entryDescription?: string;
  icon: any;
  navigationScreenName: string;
  defaultVisible?: boolean;
};

const dashboardEntries: DashboardEntry[] = [
  {
    key: 'sortation',
    screenName: 'Sortation',
    entryDescription: 'Manage sortation tasks and workflows',
    icon: IconSortation,
    navigationScreenName: 'Sortation'
  },
  {
    key: 'putaway',
    screenName: 'Putaway',
    entryDescription: 'Manage putaway tasks and workflows',
    icon: IconPutaway,
    navigationScreenName: 'SortationPutaway'
  },
  {
    key: 'picking',
    screenName: 'Picking',
    entryDescription: 'Manage orders and picking tasks',
    icon: IconPicking,
    navigationScreenName: 'Orders'
  },
  {
    key: 'packing',
    screenName: 'Packing',
    entryDescription: 'Manage packing tasks and shipments',
    icon: IconPacking,
    navigationScreenName: 'OutboundStockList'
  },
  {
    key: 'loading',
    screenName: 'Loading',
    entryDescription: 'Manage loading tasks and shipments',
    icon: IconLoading,
    navigationScreenName: 'OutboundLoadingList'
  },
  {
    key: 'receiving',
    screenName: 'Receiving',
    entryDescription: 'Manage inbound orders and receiving tasks',
    icon: IconReceiving,
    navigationScreenName: 'InboundOrderList'
  },
  {
    key: 'putawayCandidates',
    screenName: 'Putaway Candidates',
    entryDescription: 'View and manage putaway candidates',
    icon: IconPutawayCandidates,
    navigationScreenName: 'PutawayCandidates'
  },
  {
    key: 'pendingPutaways',
    screenName: 'Pending Putaways',
    entryDescription: 'View and manage pending putaway tasks',
    icon: IconPendingPutaways,
    navigationScreenName: 'PutawayList'
  },
  {
    key: 'products',
    screenName: 'Products',
    entryDescription: 'Manage products and product details',
    icon: IconProducts,
    navigationScreenName: 'Products'
  },
  {
    key: 'inventory',
    screenName: 'Inventory',
    entryDescription: 'View and manage the current inventory',
    icon: IconInventory,
    navigationScreenName: 'Product Summary'
  },
  {
    key: 'createLPN',
    screenName: 'Create LPN',
    entryDescription: 'Create a new License Plate Number (LPN)',
    icon: IconCreateLPN,
    navigationScreenName: 'CreateLpn'
  },
  {
    key: 'transfers',
    screenName: 'Transfers',
    entryDescription: 'Manage pending internal transfers',
    icon: IconPendingTransfers,
    navigationScreenName: 'Transfers'
  },
  {
    key: 'scan',
    screenName: 'Scan',
    entryDescription: 'Scan barcodes and QR codes for quick access',
    icon: IconScan,
    navigationScreenName: 'Scan'
  }
];

export function getDashboardEntries() {
  return dashboardEntries;
}

export function getDashboardEntriesKeys() {
  return dashboardEntries.map((entry) => entry.key);
}
