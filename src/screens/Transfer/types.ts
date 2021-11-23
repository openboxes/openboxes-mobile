import Location from "../../data/location/Location";
import {Dictionary} from "lodash";
import {stockTransfersAction} from "../../redux/actions/transfers";

export interface OwnProps {
    navigation: any;
}


export interface DispatchProps {
    stockTransfersAction: (
        data: any,
        callback?: (data: any) => void,
    ) => void;
    showScreenLoading: (message?: string) => void;
    hideScreenLoading: () => void;
}

export type Props = OwnProps &  DispatchProps;

export interface State {
    data: any
}