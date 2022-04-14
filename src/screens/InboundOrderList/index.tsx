/* eslint-disable complexity */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react-hooks/exhaustive-deps */
import {FlatList, Text, TouchableOpacity, View} from 'react-native';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchInboundOrderList } from '../../redux/actions/inboundorder';
import showPopup from '../../components/Popup';
import BarCodeSearchHeader from '../Products/BarCodeSearchHeader';
import { RootState } from '../../redux/reducers';
import {useNavigation, useRoute} from "@react-navigation/native";
import styles from "./styles";
import {Card} from "react-native-paper";
import EmptyView from "../../components/EmptyView";
import _ from 'lodash';

const InboundOrderList = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const location = useSelector(
    (rootState: RootState) => {
      return rootState.mainReducer.currentLocation;
    }
  );

  const [state, setState] = useState<any>({
    inboundOrders: [],
    filteredInboundOrders: [],
  });

  const [showSearchBar, setShowSearchBar] = useState<boolean>(true);

  useEffect(() => {
    return navigation.addListener('focus', () => {
      resetSearchBar();
      if (location?.id || route?.params?.refetchOrders) {
        getInboundOrderList(location?.id);
      } else {
        showPopup({
          title: 'Current location context was not set properly.',
          message: 'Please reload the app',
        })
      }
    });
  }, [route]);

  // Hacky way to get the search bar to the initial state
  // TODO: Refactor BarCodeSearchHeader to reset on a navigation change + refactor component from class component to functional
  useEffect(() => {
    if (!showSearchBar) {
      setState({ ...state, filteredInboundOrders: [] });
      setShowSearchBar(true);
    }
  }, [showSearchBar])

  const resetSearchBar = () => {
    setShowSearchBar(false);
  }

  const getInboundOrderList = (id: string = '') => {
    navigation.setParams({ refetchOrders : false });
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
          state.inboundOrders = data.filter((item: any) => {
            return (item.status === 'SHIPPED' || item.status === 'PARTIALLY_RECEIVED');
          });
        }
        setState({ ...state });
      }
    };
    dispatch(fetchInboundOrderList(callback, id));
  };

  const RenderOrderData = ({ title, subText }: any): JSX.Element => {
    return (
      <View style={styles.columnItem}>
        <Text style={styles.label}>{title}</Text>
        <Text style={styles.value}>{subText}</Text>
      </View>
    );
  };

  const navigateToInboundDetails = (item: any) => {
    navigation.navigate('InboundDetails', { shipmentDetails: item });
  };

  const RenderListItem = ({ item, index }: any): JSX.Element => {
    return (
      <TouchableOpacity
        onPress={() => navigateToInboundDetails(item)}
        style={styles.itemView}
        key={index}
      >
        <Card>
          <Card.Content>
            <View style={styles.rowItem}>
              <RenderOrderData
                title={'Identifier'}
                subText={item.shipmentNumber}
              />
              <RenderOrderData title={'Status'} subText={item.status} />
            </View>
            <View style={styles.rowItem}>
              <RenderOrderData title={'Origin'} subText={item.origin.name} />
              <RenderOrderData
                title={'Destination'}
                subText={item.destination.name}
              />
            </View>
            <View style={styles.rowItem}>
              <RenderOrderData title={'Description'} subText={item.name} />
              <RenderOrderData
                title={'Number of Items'}
                subText={item.shipmentItems.length}
              />
            </View>
          </Card.Content>
        </Card>
      </TouchableOpacity>
    );
  };

  const filterInboundOrders = (searchTerm: string) => {
    if (searchTerm) {
      const exactInboundOrder = _.find(
        state.inboundOrders,
        (inboundOrder: any) => inboundOrder?.shipmentNumber?.toLowerCase() === searchTerm.toLowerCase(),
      );

      if (exactInboundOrder) {
        setState({
          ...state,
          filteredInboundOrders: [],
        });
        navigateToInboundDetails(exactInboundOrder);
      } else {
        const filteredInboundOrders = _.filter(
          state.inboundOrders,
          (inboundOrder: any) => inboundOrder?.shipmentNumber?.toLowerCase()?.includes(searchTerm.toLowerCase()),
        );
        setState({
          ...state,
          filteredInboundOrders,
        });
      }

      return;
    }

    setState({
      ...state,
      filteredInboundOrders: [],
    });
  }

  return (
    <View style={{ flex: 1, zIndex: -1 }}>
      {showSearchBar && (
        <BarCodeSearchHeader
          placeholder="Search by order number"
          onBarCodeSearchQuerySubmitted={filterInboundOrders}
          searchBox={false}
          autoSearch
        />
      )}
      {state.inboundOrders.length > 0 ? (
        <FlatList
          data={state.filteredInboundOrders.length > 0 ? state.filteredInboundOrders : state.inboundOrders}
          keyExtractor={inboundOrder => inboundOrder.id}
          renderItem={RenderListItem}
        />
      ) : (
        <EmptyView title="Receiving" description="There are no items to receive" isRefresh={false} />
      )}
    </View>
  );
};

export default InboundOrderList;
