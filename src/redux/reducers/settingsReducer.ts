import { GROUP_LOCATION_ENTIRES, SettingsActionTypes } from '../actions/settings';

type SettingsState = {
  groupLocationEntries: boolean;
};

const initialState: SettingsState = {
  groupLocationEntries: false
};

function settingsReducer(state = initialState, action: SettingsActionTypes): SettingsState {
  switch (action.type) {
    case GROUP_LOCATION_ENTIRES: {
      return {
        ...state,
        groupLocationEntries: action.payload.group
      };
    }
    default: {
      return state;
    }
  }
}

export default settingsReducer;
