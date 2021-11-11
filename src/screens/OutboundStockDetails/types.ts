import PutAway from "../../data/putaway/PutAway";
import {NavigationState} from "../PutAwayDetail/State";
import {fetchPutAwayFromOrderAction} from "../../redux/actions/putaways";
import {Shipment} from "../../data/container/Shipment";

export interface State {
    error: string | null
    shipment: Shipment | null
}


export interface OwnProps {
    exit: () => void
    navigation: any;
    route: any;
}

export interface StateProps {
    outboundStockList: any,
    SelectedLocation: any
}

export interface DispatchProps {
    showScreenLoading: (message?: string) => void;
    hideScreenLoading: () => void;
    getShipmentReadyToBePacked: (
        id: string,
        callback: (data: any) => void
    ) => void;
}

export type Props = OwnProps & StateProps & DispatchProps
