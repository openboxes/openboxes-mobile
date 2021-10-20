export interface OwnProps {
    label: string,
    showSelect?: boolean
}

export interface StateProps {}

export interface DispatchProps {}

export type Props = OwnProps & StateProps & DispatchProps;
