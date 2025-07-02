export const DASHBOARD_ENTRIES_VISIBILITY = 'DASHBOARD_ENTRIES_VISIBILITY';
export const DASHBOARD_ENTRIES_VISIBILITY_RESET = 'DASHBOARD_ENTRIES_VISIBILITY_RESET';
export const GROUP_LOCATION_ENTRIES = 'GROUP_LOCATION_ENTRIES';

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

type SetDashboardEntriesVisibilityResetAction = {
  type: typeof DASHBOARD_ENTRIES_VISIBILITY_RESET;
};

// Create a union type for all action types in this file.
// e.g., export type SettingsActionTypes = SetGroupLocationEntriesAction | SetThemeAction;
export type SettingsActionTypes =
  | SetGroupLocationEntriesAction
  | SetDashboardEntriesVisibilityAction
  | SetDashboardEntriesVisibilityResetAction;

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

export const resetDashboardEntriesVisibility = (): SetDashboardEntriesVisibilityResetAction => {
  return {
    type: DASHBOARD_ENTRIES_VISIBILITY_RESET
  };
};
