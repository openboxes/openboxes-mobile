import {getShipmentPacking} from "../../redux/actions/packing";
import {getContainer} from "../../redux/actions/lpn";

export interface OwnProps {
    route: any;
    exit: () => void;
    navigation: any;

}

export interface StateProps {
    //no-op
}


export interface DispatchProps {
    fetchContainer: (id: string, callback: (data: any) => void) => void;
    getShipmentPacking: (id: string, callback: (data: any) => void) => void;
    getContainer: (id: string, callback: (data: any) => void) => void;
}

export type Props = OwnProps & StateProps & DispatchProps;
