export interface OwnProps {
  navigation: any;
  route: any;
}

export interface StateProps {
  candidates: any;
  currentLocation: any;
  productSummaryConfig: {
    [key: string]: boolean;
  };
}

export interface DispatchProps {
  getCandidates: (locationId: string, callback?: (data: any) => void, suppressLoading?: boolean) => void;
}

export type Props = OwnProps & StateProps & DispatchProps;

export interface State {
  putawayCandidates: any;
  refreshing: boolean;
  filteredPutawayCandidates: any;
  initialLoading: boolean;
  searchTerm: string;
}
