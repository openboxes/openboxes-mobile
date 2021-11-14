export interface OwnProps {
    label: string,
    showSelect?: boolean
    refs?: any
    value?: string | any
    onChange?: any
    disabled?: boolean
    keyboard?: any
    editable?: boolean
    onEndEdit?: (text: string) => void
    style?: any
    data?: any
}

export interface StateProps {
}

export interface DispatchProps {
}

export type Props = OwnProps & StateProps & DispatchProps;
