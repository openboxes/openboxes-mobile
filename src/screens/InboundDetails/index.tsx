import React, {useEffect, useState} from "react";
import {useDispatch} from "react-redux";
import {fetchPartialReceiving} from "../../redux/actions/inboundorder";
import showPopup from "../../components/Popup";
import InboundOrderContainer from "./InboundOrderContainer";
import {useNavigation, useRoute} from "@react-navigation/native";
import {InboundDetailOwnProps} from "./types";
import InboundVMMapper from "./InboundVMMapper";

const InboundDetails = () => {
  const dispatch = useDispatch();
  const route = useRoute();
  const navigation = useNavigation();
  const {shipmentDetails}: any = route.params
  const [state, setState] = useState<InboundDetailOwnProps>({
    inboundDetail: null,
    inboundData: null
  })

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getPartialReceiving(shipmentDetails.id)
    });
    return unsubscribe;
  }, [navigation]);


  const getPartialReceiving = (id: string = "") => {
    const callback = (data: any) => {
      if (data?.error) {
        showPopup({
          title: data.errorMessage
              ? `Inbound order details`
              : null,
          message:
              data.errorMessage ??
              `Failed to load inbound order details value ${id}`,
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
          data={state.inboundData?.sectionData ?? []}
          shipmentId={state.inboundData?.shipmentId}
          shipmentData={shipmentDetails}
      />
  );
}
export default InboundDetails;
