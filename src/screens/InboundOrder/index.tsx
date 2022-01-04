/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react-hooks/exhaustive-deps */
import { View } from 'react-native';
import React, { useEffect, useState } from 'react';
import InboundOrderList from './InboundOrderList';
import { fetchInboundOrderList } from '../../redux/actions/inboundorder';
import showPopup from '../../components/Popup';
import BarCodeSearchHeader from '../Products/BarCodeSearchHeader';
import { RootState } from '../../redux/reducers';
import { useDispatch, useSelector } from 'react-redux';

const InboundOrder = () => {
  const dispatch = useDispatch();

  const location = useSelector(
    (rootState: RootState) => rootState.mainReducer.currentLocation
  );

  const [state, setState] = useState({
    inboundOrder: {}
  });
  useEffect(() => {
    getInboundOrderList();
  }, []);
  const getInboundOrderList = (id: string = '') => {
    const callback = (data: any) => {
      if (data?.error) {
        showPopup({
          title: data.errorMessage ? 'Inbound order details' : null,
          message:
            data.errorMessage ??
            `Failed to load inbound order details value ${id}`,
          positiveButton: {
            text: 'Retry',
            callback: () => {
              dispatch(fetchInboundOrderList(callback, id));
            }
          },
          negativeButtonText: 'Cancel'
        });
      } else {
        if (data && Object.keys(data).length !== 0) {
          state.inboundOrder = data.filter((item: any) => {
            return (
              (item?.destination?.name?.toLowerCase() ===
                location?.name?.toLowerCase() &&
                item.status === 'SHIPPED') ||
              item.status === 'PARTIALLY_RECEIVED'
            );
          });
        }
        setState({ ...state });
      }
    };
    dispatch(fetchInboundOrderList(callback, id));
  };

  return (
    <View style={{ flex: 1, zIndex: -1 }}>
      <BarCodeSearchHeader
        onBarCodeSearchQuerySubmitted={getInboundOrderList}
        searchBox={false}
        autoSearch={undefined}
      />
      <InboundOrderList data={state.inboundOrder} />
    </View>
  );
};
export default InboundOrder;
