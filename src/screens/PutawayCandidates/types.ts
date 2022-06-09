export interface OwnProps {
  navigation: any;
  route: any;
}

export interface StateProps {
  candidates: any;
  currentLocation: any;
}

export interface DispatchProps {
  showScreenLoading: (message?: string) => void;
  hideScreenLoading: () => void;
  getCandidates: (locationId: string, callback?: (data: any) => void) => void;
}

export type Props = OwnProps & StateProps & DispatchProps;

export interface State {
  putawayCandidates: any;
  refreshing: boolean;
  filteredPutawayCandidates: any;
}
