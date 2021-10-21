export interface OwnProps {
    label: string,
    showSelect?: boolean
    refs?: any
    value?: string
    onChange?: (text:string) => void;
    disabled?: boolean
    keyboard?: any
}

export interface StateProps {}

export interface DispatchProps {}

export type Props = OwnProps & StateProps & DispatchProps;
