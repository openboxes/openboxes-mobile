import PutAwayItems from "../../data/putaway/PutAwayItems";
import BinLocation from "../../data/picklist/BinLocation";
import PutAway from "../../data/putaway/PutAway";

export interface State {
    error: string | null

    putAway: PutAway | null
    putAwayItem: PutAwayItems | null
    orderId: string | null,
    binLocationSearchQuery: string | null
    binLocation: BinLocation | null
    quantityPicked: string | "0"

}


export interface OwnProps {
    exit: () => void
    orderId: string,
    navigation: any;
}

export interface StateProps {
    putAwayItem: any
}

export interface DispatchProps {
    showScreenLoading: (message?: string) => void;
    hideScreenLoading: () => void;
    searchLocationByLocationNumber: (
        locationNumber: string,
        callback: (data: any) => void,
    ) => void;

}

export type Props = OwnProps & StateProps & DispatchProps
