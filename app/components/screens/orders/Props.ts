export interface OwnProps {
  exit: () => void
}

export interface StateProps {
  //no-op
}

export interface DispatchProps {
  showProgressBar: (message?: string) => void
  hideProgressBar: () => void
}

export type Props = OwnProps & StateProps & DispatchProps
