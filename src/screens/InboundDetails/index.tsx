import {View} from "react-native";
import React, {useEffect, useState} from "react";
import {useDispatch} from "react-redux";
import {fetchInboundOrderList, fetchPartialReceiving} from "../../redux/actions/inboundorder";
import showPopup from "../../components/Popup";
import InboundOrderContainer from "./InboundOrderContainer";
import {useRoute} from "@react-navigation/native";
import {InboundDetailOwnProps} from "./types";
import InboundVMMapper from "./InboundVMMapper";

const InboundDetails = () => {
    const dispatch = useDispatch();
    const route = useRoute();
    const {shipmentDetails}: any = route.params
    const [state, setState] = useState<InboundDetailOwnProps>({
        inboundDetail: null,
        inboundData: null
    })
    useEffect(() => {
        getPartialReceiving(shipmentDetails.id)
    }, [shipmentDetails])

    const getPartialReceiving = (id: string = "") => {
        const callback = (data: any) => {
            if (data?.error) {
                showPopup({
                    title: data.error.message
                        ? `In Bound order details`
                        : null,
                    message:
                        data.error.message ??
                        `Failed to load Inbound order details value ${id}`,
                    positiveButton: {
                        text: 'Retry',
                        callback: () => {
                            dispatch(fetchPartialReceiving(callback, id));
                        },
                    },
                    negativeButtonText: 'Cancel',
                });
            } else {
                if (data && Object.keys(data).length !== 0) {
                    state.inboundDetail = data
                    state.inboundData = InboundVMMapper(state)
                }
                setState({...state})
            }
        }
        dispatch(fetchPartialReceiving(callback, id))
    }


    return (
        <InboundOrderContainer
            data={state.inboundData?.sectionData??[]}
            shipmentId={state.inboundData?.shipmentId}
            shipmentData={shipmentDetails}
        />
    );
}
export default InboundDetails;