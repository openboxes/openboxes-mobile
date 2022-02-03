export interface OwnProps {
  navigation: any,
  route: any;
}

export interface StateProps {
  binLocations: any
  currentLocation: any
}

export interface DispatchProps {
  showScreenLoading: (message?: string) => void;
  hideScreenLoading: () => void;
  getBinLocationsAction: (callback?: () => void) => void;
  createPutawayOderAction: (data: any, callback?: (data) => void) => void
}

export type Props = OwnProps & StateProps & DispatchProps;

export interface State {
  selectedLocation: any,
  quantity: string
}
