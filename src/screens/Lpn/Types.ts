import Location from "../../data/location/Location";

export interface OwnProps {

}

export interface StateProps {
    //no-op
    currentLocation?: Location | null;
}


export interface DispatchProps {
    getShipmentOrigin: (id : string, callback: (data: any) => void) => void;
    getShipmentPacking: (id: any, callback: (data: any) => void) => void;
    saveAndUpdateLpn: (requestBody: any, callback: (data: any) => void) => void;
}

export type Props = OwnProps & StateProps & DispatchProps;
