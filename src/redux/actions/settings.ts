export const GROUP_LOCATION_ENTIRES = 'GROUP_LOCATION_ENTIRES';

type SetGroupLocationEntriesAction = {
  type: typeof GROUP_LOCATION_ENTIRES;
  payload: {
    group: boolean;
  };
};

// Create a union type for all action types in this file.
// e.g., export type SettingsActionTypes = SetGroupLocationEntriesAction | SetThemeAction;
export type SettingsActionTypes = SetGroupLocationEntriesAction;

export const setGroupLocationEntries = (group: boolean): SetGroupLocationEntriesAction => {
  return {
    type: GROUP_LOCATION_ENTIRES,
    payload: { group }
  };
};
