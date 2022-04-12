export interface OwnProps {
  navigation: any;
}

export interface StateProps {
  //no-op
}

export interface DispatchProps {
  //no-op
}

export type Props = OwnProps & StateProps & DispatchProps;

export interface State {
  // navigationState: NavigationState;
}
