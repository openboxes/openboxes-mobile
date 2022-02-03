export interface OwnProps {
  navigation: any
}

export interface StateProps {
  candidates: any
  currentLocation: any
}

export interface DispatchProps {
  showScreenLoading: (message?: string) => void;
  hideScreenLoading: () => void;
  getCandidates: (locationId: string, callback?: (data) => void) => void;
}

export type Props = OwnProps & StateProps & DispatchProps;

export interface State {
  selectedItem: any
}
