
export interface OwnProps {

}

export interface StateProps {
    //no-op
}


export interface DispatchProps {
    getContainerType: (callback: (data: any) => void) => void;
    getShipmentPacking: (id: any, callback: (data: any) => void) => void;
    saveAndUpdateLpn: (requestBody: any, callback: (data: any) => void) => void;
}

export type Props = OwnProps & StateProps & DispatchProps;
