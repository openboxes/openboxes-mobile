export interface OwnProps {
    label: string,
    refs?: any
    edit: boolean | any
    value?: string | any
    disabled?: boolean
    keyboard?: any
    onEndEdit?: (text: string) => void
    data?: any
    containerStyle?: any
    onChange: (text: string) => void;
    icon?: string
    inputStyle?: any
    menuStyle?: any
    right?: () => void
    left?: () => void
}

export interface StateProps {
}

export interface DispatchProps {
}

export type Props = OwnProps & StateProps & DispatchProps;
