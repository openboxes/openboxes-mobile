export const DASHBOARD_ENTRIES_VISIBILITY = 'DASHBOARD_ENTRIES_VISIBILITY';
export const DASHBOARD_ENTRIES_VISIBILITY_RESET = 'DASHBOARD_ENTRIES_VISIBILITY_RESET';
export const DASHBOARD_ENTRIES_ORDER = 'DASHBOARD_ENTRIES_ORDER';
export const GROUP_LOCATION_ENTRIES = 'GROUP_LOCATION_ENTRIES';
export const PRODUCT_SUMMARY_CONFIG = 'PRODUCT_SUMMARY_CONFIG';
export const BARCODE_SCAN_DEBOUNCE = 'BARCODE_SCAN_DEBOUNCE';
export const SEARCH_DEBOUNCE = 'SEARCH_DEBOUNCE';
export const ALLOW_REALLOCATION_DURING_PICKING = 'ALLOW_REALLOCATION_DURING_PICKING';

type SetAllowReallocationDuringPickingAction = {
  type: typeof ALLOW_REALLOCATION_DURING_PICKING;
  payload: {
    allow: boolean;
  };
};

type SetGroupLocationEntriesAction = {
  type: typeof GROUP_LOCATION_ENTRIES;
  payload: {
    group: boolean;
  };
};

type SetDashboardEntriesVisibilityAction = {
  type: typeof DASHBOARD_ENTRIES_VISIBILITY;
  payload: { entryKey: string; visible: boolean };
};

type ResetDashboardEntriesVisibility = {
  type: typeof DASHBOARD_ENTRIES_VISIBILITY_RESET;
};

type SetProductSummaryConfigAction = {
  type: typeof PRODUCT_SUMMARY_CONFIG;
  payload: { key: string; visible: boolean };
};

type SetDashboardEntriesOrderAction = {
  type: typeof DASHBOARD_ENTRIES_ORDER;
  payload: string[];
};

type SetBarcodeScanDebounceAction = {
  type: typeof BARCODE_SCAN_DEBOUNCE;
  payload: number;
};

type SetSearchDebounceAction = {
  type: typeof SEARCH_DEBOUNCE;
  payload: number;
};

// Create a union type for all action types in this file.
// e.g., export type SettingsActionTypes = SetGroupLocationEntriesAction | SetThemeAction;
export type SettingsActionTypes =
  | SetGroupLocationEntriesAction
  | SetDashboardEntriesVisibilityAction
  | ResetDashboardEntriesVisibility
  | SetDashboardEntriesOrderAction
  | SetProductSummaryConfigAction
  | SetBarcodeScanDebounceAction
  | SetSearchDebounceAction
  | SetAllowReallocationDuringPickingAction;

export const setGroupLocationEntries = (group: boolean): SetGroupLocationEntriesAction => {
  return {
    type: GROUP_LOCATION_ENTRIES,
    payload: { group }
  };
};

export const setDashboardEntriesVisibility = (
  entryKey: string,
  visible: boolean
): SetDashboardEntriesVisibilityAction => {
  return {
    type: DASHBOARD_ENTRIES_VISIBILITY,
    payload: { entryKey, visible }
  };
};

export const resetDashboardEntriesVisibility = (): ResetDashboardEntriesVisibility => {
  return {
    type: DASHBOARD_ENTRIES_VISIBILITY_RESET
  };
};

export const setDashboardEntriesOrder = (order: string[]): SetDashboardEntriesOrderAction => {
  return {
    type: DASHBOARD_ENTRIES_ORDER,
    payload: order
  };
};

export const setProductSummaryConfig = (key: string, visible: boolean): SetProductSummaryConfigAction => {
  return {
    type: PRODUCT_SUMMARY_CONFIG,
    payload: { key, visible }
  };
};

export const setBarcodeScanDebounce = (value: number): SetBarcodeScanDebounceAction => {
  return {
    type: BARCODE_SCAN_DEBOUNCE,
    payload: value
  };
};

export const setSearchDebounce = (value: number): SetSearchDebounceAction => {
  return {
    type: SEARCH_DEBOUNCE,
    payload: value
  };
};

export const setAllowReallocationDuringPicking = (allow: boolean): SetAllowReallocationDuringPickingAction => {
  return {
    type: ALLOW_REALLOCATION_DURING_PICKING,
    payload: { allow }
  };
};
