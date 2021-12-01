/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react-hooks/exhaustive-deps */
import {View} from 'react-native';
import React, {useEffect, useState} from 'react';
import InboundOrderList from './InboundOrderList';
import {useDispatch} from 'react-redux';
import {fetchInboundOrderList} from '../../redux/actions/inboundorder';
import showPopup from '../../components/Popup';
import BarCodeSearchHeader from '../Products/BarCodeSearchHeader';

const InboundOrder = () => {
  const dispatch = useDispatch();
  const [state, setState] = useState({
    inboundOrder: {},
  });
  useEffect(() => {
    getInboundOrderList();
  }, []);
  const getInboundOrderList = (id: string = '') => {
    const callback = (data: any) => {
      if (data?.error) {
        showPopup({
          title: data.error.message ? 'Inbound order details' : null,
          message:
            data.error.message ??
            `Failed to load inbound order details value ${id}`,
          positiveButton: {
            text: 'Retry',
            callback: () => {
              dispatch(fetchInboundOrderList(callback, id));
            },
          },
          negativeButtonText: 'Cancel',
        });
      } else {
        if (data && Object.keys(data).length !== 0) {
          state.inboundOrder = data.filter((item: any) => {
            return (
              item.status === 'SHIPPED' || item.status === 'PARTIALLY_RECEIVED'
            );
          });
        }
        setState({...state});
      }
    };
    dispatch(fetchInboundOrderList(callback, id));
  };

  return (
    <View style={{zIndex: -1}}>
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
