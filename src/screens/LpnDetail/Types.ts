
export interface OwnProps {
    route: any;
    exit: () => void;

}

export interface StateProps {
    //no-op
}


export interface DispatchProps {
    fetchContainer: (id: string, callback: (data: any) => void) => void;
}

export type Props = OwnProps & StateProps & DispatchProps;
