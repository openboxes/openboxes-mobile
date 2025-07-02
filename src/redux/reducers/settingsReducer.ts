import {
  DASHBOARD_ENTRIES_VISIBILITY,
  DASHBOARD_ENTRIES_VISIBILITY_RESET,
  GROUP_LOCATION_ENTRIES,
  SettingsActionTypes
} from '../actions/settings';

type SettingsState = {
  groupLocationEntries: boolean;
  dashboardEntriesVisibility: { [key: string]: boolean };
};

const initialState: SettingsState = {
  groupLocationEntries: false,
  dashboardEntriesVisibility: {}
};

function settingsReducer(state = initialState, action: SettingsActionTypes): SettingsState {
  switch (action.type) {
    case GROUP_LOCATION_ENTRIES: {
      return {
        ...state,
        groupLocationEntries: action.payload.group
      };
    }
    case DASHBOARD_ENTRIES_VISIBILITY: {
      const { entryKey, visible } = action.payload;

      return {
        ...state,
        dashboardEntriesVisibility: {
          ...state.dashboardEntriesVisibility,
          [entryKey]: visible
        }
      };
    }
    case DASHBOARD_ENTRIES_VISIBILITY_RESET: {
      return {
        ...state,
        dashboardEntriesVisibility: {}
      };
    }
    default: {
      return state;
    }
  }
}

export default settingsReducer;
