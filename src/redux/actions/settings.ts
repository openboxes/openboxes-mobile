export const DASHBOARD_ENTRIES_VISIBILITY = 'DASHBOARD_ENTRIES_VISIBILITY';
export const DASHBOARD_ENTRIES_VISIBILITY_RESET = 'DASHBOARD_ENTRIES_VISIBILITY_RESET';
export const GROUP_LOCATION_ENTRIES = 'GROUP_LOCATION_ENTRIES';
export const PRODUCT_SUMMARY_CONFIG = 'PRODUCT_SUMMARY_CONFIG';

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

// Create a union type for all action types in this file.
// e.g., export type SettingsActionTypes = SetGroupLocationEntriesAction | SetThemeAction;
export type SettingsActionTypes =
  | SetGroupLocationEntriesAction
  | SetDashboardEntriesVisibilityAction
  | ResetDashboardEntriesVisibility
  | SetProductSummaryConfigAction;

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

export const setProductSummaryConfig = (key: string, visible: boolean): SetProductSummaryConfigAction => {
  return {
    type: PRODUCT_SUMMARY_CONFIG,
    payload: { key, visible }
  };
};
