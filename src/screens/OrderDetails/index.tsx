import _ from 'lodash';
import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { Props } from './types';
import PickList from '../../data/picklist/PickList';
import { PicklistItem } from '../../data/picklist/PicklistItem';
import { Props as LabeledDataType } from '../../components/LabeledData/types';

import { showScreenLoading, hideScreenLoading } from '../../redux/actions/main';
import { getPickListAction } from '../../redux/actions/orders';

import { Alert } from 'react-native';
import PickOrderItem from '../PickList';
import Button from '../../components/Button';
import { ContentContainer, ContentHeader, ContentFooter, ContentBody } from '../../components/ContentLayout';
import DetailsTable from '../../components/DetailsTable';
import showPopup from '../../components/Popup';
import { orderDetailsVMMapper } from './OrderDetailsVMMapper';

const OrderDetails: React.FC<Props> = (props) => {
  const [pickList, setPickList] = useState<PickList | null>(null);
  const [pickListItems, setPickListItems] = useState<PicklistItem[]>([]);
  const [initialPicklistItemIndex, setInitialPicklistItemIndex] = useState<number>(0);

  const dispatch = useDispatch();

  const getInitiallyDisplayedPickItemIndex = (picklistItems: any) => {
    return _.findIndex(picklistItems, (item: any) => Number(item.quantityRemaining) > 0);
  };

  const getOrderDetails = () => {
    dispatch(showScreenLoading('Loading'));
    const { order } = props.route.params;

    const actionCallback = (data: any) => {
      if (data?.length === 0) {
        dispatch(hideScreenLoading());
        setPickList(null);
        setPickListItems([]);
        props.navigation.navigate('Orders', {
          refetchOrders: true
        });
        showPopup({ message: 'No Picklist found', positiveButton: 'ok' });
        return;
      }

      const initialPicklistItemIndex = getInitiallyDisplayedPickItemIndex(data?.picklistItems);

      if (initialPicklistItemIndex === -1) {
        Alert.alert(
          'All items are picked',
          'What do you want to do now?',
          [
            {
              text: 'Go back',
              onPress: () =>
                props.navigation.navigate('Orders', {
                  refetchOrders: true
                })
            },
            {
              text: 'Move to Packing',
              onPress: () =>
                props.navigation.navigate('PackingLocationPage', {
                  orderId: order?.id,
                  packingLocation: order?.packingLocation
                })
            },
            {
              text: 'View',
              onPress: () => null
            }
          ],
          {
            cancelable: false
          }
        );
      }
      setPickList(data);
      setPickListItems(
        _.map(data.picklistItems, (item: any) => ({
          ...item,
          quantityToPick: item.quantityRemaining
        }))
      );
      setInitialPicklistItemIndex(initialPicklistItemIndex);
      dispatch(hideScreenLoading());
    };

    dispatch(getPickListAction(order?.picklist?.id, actionCallback));
  };

  useEffect(() => {
    getOrderDetails();
  }, []);

  const {
    id: orderId,
    identifier,
    status,
    destination,
    expectedShippingDate,
    packingLocation
  } = orderDetailsVMMapper(props.route?.params);

  const statusMessage = _.get(pickList, 'statusMessage', '0');

  const detailsData: LabeledDataType[] = [
    { label: 'Identifier', value: identifier },
    { label: 'Status', value: `${status} (Picked ${statusMessage})` },
    { label: 'Destination', value: `${destination?.locationNumber}-${destination?.name}` },
    { label: 'Expected Shipping Date', value: `${expectedShippingDate}` }
  ];

  return (
    <ContentContainer>
      <ContentHeader>
        <DetailsTable data={detailsData} />
      </ContentHeader>
      <ContentBody>
        {!_.isEmpty(pickListItems) && (
          <PickOrderItem
            picklistItems={pickListItems}
            selectedPicklistItemIndex={initialPicklistItemIndex}
            successfulPickCallback={getOrderDetails}
          />
        )}
      </ContentBody>
      <ContentFooter fixed>
        <Button
          title="Move to Packing"
          onPress={() =>
            props.navigation.navigate('PackingLocationPage', {
              orderId,
              packingLocation
            })
          }
        />
      </ContentFooter>
    </ContentContainer>
  );
};

export default OrderDetails;
