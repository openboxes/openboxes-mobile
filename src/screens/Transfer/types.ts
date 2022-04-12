 export interface OwnProps {
  navigation: any;
}

export interface DispatchProps {
  stockTransfersAction: (data: any, callback?: (data: any) => void) => void;
  showScreenLoading: (message?: string) => void;
  hideScreenLoading: () => void;
}

export interface State {
  data: any;
}
export type Props = OwnProps & DispatchProps;
