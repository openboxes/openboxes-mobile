import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { fetchPartialReceiving } from '../../redux/actions/inboundorder';
import showPopup from '../../components/Popup';
import InboundOrderContainer from './InboundOrderContainer';
import { useNavigation, useRoute } from '@react-navigation/native';
import { InboundDetailOwnProps } from './types';
import InboundVMMapper, { containerParamMapper } from './InboundVMMapper';

const InboundDetails = () => {
  const dispatch = useDispatch();
  const route = useRoute();
  const navigation = useNavigation<any>();
  const { shipmentDetails }: any = route.params;
  const [state, setState] = useState<InboundDetailOwnProps>({
    inboundDetail: null,
    inboundData: null
  });

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getPartialReceiving(shipmentDetails.id);
    });
    return unsubscribe;
  }, [navigation]);

  const getPartialReceiving = (id: string = '') => {
    const callback = (data: any) => {
      if (data?.error) {
        showPopup({
          title: data.errorMessage ? 'Inbound order details' : null,
          message: data.errorMessage ?? `Failed to load inbound order details value ${id}`,
          positiveButton: {
            text: 'Retry',
            callback: () => {
              dispatch(fetchPartialReceiving(callback, id));
            }
          },
          negativeButtonText: 'Cancel'
        });
      } else {
        if (data && Object.keys(data).length !== 0) {
          const paramContainers = _.get(shipmentDetails, 'containers', []);
          const dataContainers = _.get(data, 'containers', []);
          if (dataContainers.length === 0) {
            data.containers = containerParamMapper(paramContainers);
          }
          if (data.containers) {
            const shipmentItems = _.flatten(_.map(data.containers, (container) => container.shipmentItems));
            const quantitiesRemaining = shipmentItems ? _.map(shipmentItems, (item) => item.quantityRemaining) : [];
            const totalQuantityRemaining = quantitiesRemaining
              ? _.reduce(quantitiesRemaining, (sum, qty) => sum + (qty > 0 ? qty : 0), 0)
              : 0;

            if (totalQuantityRemaining <= 0) {
              showPopup({
                title: 'All items are received',
                message: 'Do you want to go back?',
                positiveButton: {
                  text: 'Ok',
                  callback: () =>
                    navigation.navigate('InboundOrderList', {
                      refetchOrders: true
                    })
                },
                negativeButtonText: 'Cancel'
              });
            }
          }

          state.inboundDetail = data;
          state.inboundData = InboundVMMapper(state);
        }
        setState({ ...state });
      }
    };
    dispatch(fetchPartialReceiving(callback, id));
  };

  return (
    <InboundOrderContainer
      data={state.inboundData?.sectionData ?? []}
      shipmentId={state.inboundData?.shipmentId}
      shipmentData={shipmentDetails}
    />
  );
};
export default InboundDetails;
