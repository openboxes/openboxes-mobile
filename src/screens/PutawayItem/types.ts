export interface OwnProps {
  navigation: any,
  route: any;
}

export interface StateProps {
  currentLocation: any
}

export interface DispatchProps {
  showScreenLoading: (message?: string) => void;
  hideScreenLoading: () => void;
  searchInternalLocations: (searchTerm: string, additionalParams: any, callback?: (data: any) => void) => void;
  createPutawayOderAction: (data: any, callback?: (data: any) => void) => void
}

export type Props = OwnProps & StateProps & DispatchProps;

export interface State {
  selectedLocation: any,
  internalLocations: any,
  quantity: string
}
