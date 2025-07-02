export interface OwnProps {
  navigation: any;
}

export interface StateProps {
  dashboardEntriesVisibility: { [key: string]: boolean };
}

export interface DispatchProps {
  //no-op
}

export type Props = OwnProps & StateProps & DispatchProps;

export interface State {
  // navigationState: NavigationState;
}
