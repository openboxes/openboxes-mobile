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

export interface DispatchProps {
    fetchInboundOrderList: (
        id: string,
        callback: (data: any) => void,
    ) => void;

}

export type Props = DispatchProps & OwnProps
export default InboundOrderProps
