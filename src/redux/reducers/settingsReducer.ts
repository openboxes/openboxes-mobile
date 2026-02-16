import { getDashboardEntriesKeys } from '../../screens/Dashboard/dashboardData';
import {
  DASHBOARD_ENTRIES_ORDER,
  DASHBOARD_ENTRIES_VISIBILITY,
  DASHBOARD_ENTRIES_VISIBILITY_RESET,
  GROUP_LOCATION_ENTRIES,
  PRODUCT_SUMMARY_CONFIG,
  BARCODE_SCAN_DEBOUNCE,
  SettingsActionTypes
} from '../actions/settings';
import { appConfig } from '../../constants';

type SettingsState = {
  groupLocationEntries: boolean;
  dashboardEntriesVisibility: { [key: string]: boolean };
  dashboardEntriesOrder: string[];
  productSummaryConfig: { [key: string]: boolean };
  barcodeScanDebounceTime: number;
};

const initialState: SettingsState = {
  groupLocationEntries: false,
  dashboardEntriesOrder: getDashboardEntriesKeys(),
  dashboardEntriesVisibility: {},
  productSummaryConfig: {},
  barcodeScanDebounceTime: appConfig.DEFAULT_DEBOUNCE_TIME
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
    case PRODUCT_SUMMARY_CONFIG: {
      const { key, visible } = action.payload;

      return {
        ...state,
        productSummaryConfig: {
          ...state.productSummaryConfig,
          [key]: visible
        }
      };
    }
    case DASHBOARD_ENTRIES_ORDER:
      return {
        ...state,
        dashboardEntriesOrder: action.payload
      };
    case BARCODE_SCAN_DEBOUNCE:
      return {
        ...state,
        barcodeScanDebounceTime: action.payload
      };
    default: {
      return state;
    }
  }
}

export default settingsReducer;
