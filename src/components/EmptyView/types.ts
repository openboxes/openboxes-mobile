export interface OwnProps {
  title: string;
  description?: any;
  isRefresh: boolean | any;
  uri?: string | any;
  onPress?: () => void;
}

export interface StateProps {}

export interface DispatchProps {}

export type Props = OwnProps & StateProps & DispatchProps;
