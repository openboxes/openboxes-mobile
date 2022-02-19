import PutAwayItems from "../../data/putaway/PutAwayItems";
import BinLocation from "../../data/picklist/BinLocation";
import PutAway from "../../data/putaway/PutAway";
import {fetchInboundOrderList} from "../../redux/actions/inboundorder";

export interface State {
    error: string | null
    inboundOrder: any
}

type InboundOrderProps = {
    data: any
}

export interface OwnProps {
    navigation: any;
    route: any;
}

export interface StateProps {
}

export interface DispatchProps {
    fetchInboundOrderList: (
        id: string,
        callback: (data: any) => void,
    ) => void;

}

export type Props = StateProps & DispatchProps & OwnProps
export default InboundOrderProps