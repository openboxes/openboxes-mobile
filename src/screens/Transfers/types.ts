import PutAway from "../../data/putaway/PutAway";
import {NavigationState} from "../PutAwayDetail/State";
import {fetchPutAwayFromOrderAction} from "../../redux/actions/putaways";

export interface State {
    error: string | null
    transfersList: PutAway[] | null
}

export interface OwnProps {
    exit: () => void
    orderId: string,
    navigation: any;
}

export interface StateProps {
    putAway: any
}

export interface DispatchProps {
    showScreenLoading: (message?: string) => void;
    hideScreenLoading: () => void;
    getOrdersAction: (
        orderNumber: string,
        callback: (data: any) => void
    ) => void;
    getStockTransfers: (
        callback: (data: any) => void
    ) => void;
    fetchTransfersList: (
        q: string | null,
        callback: (data: any) => void
    ) => void;
}

export type Props = OwnProps & StateProps & DispatchProps
