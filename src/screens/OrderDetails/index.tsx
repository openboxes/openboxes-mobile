import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import { Alert, View } from 'react-native';
import { Chip, Divider, Subheading, Text } from 'react-native-paper';
import { useDispatch } from 'react-redux';

import Button from '../../components/Button';
import { ContentBody, ContentContainer, ContentFooter, ContentHeader } from '../../components/ContentLayout';
import showPopup from '../../components/Popup';
import PickList from '../../data/picklist/PickList';
import { PicklistItem } from '../../data/picklist/PicklistItem';
import { hideScreenLoading, showScreenLoading } from '../../redux/actions/main';
import { getPickListAction } from '../../redux/actions/orders';
import { parseDateToISODate, parseFromISODateToLocaleString } from '../../utils/utils';
import PickOrderItem from '../PickList';
import { orderDetailsVMMapper } from './OrderDetailsVMMapper';
import styles from './styles';
import { Props } from './types';

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

  const parsedExpectedShippingDate = parseDateToISODate(expectedShippingDate);
  const formattedExpectedShippingDate = parseFromISODateToLocaleString(parsedExpectedShippingDate);

  const statusMessage = _.get(pickList, 'statusMessage', '0');

  return (
    <ContentContainer>
      <ContentHeader style={styles.contentHeader}>
        <View style={styles.headerRow}>
          <View style={styles.identifierContainer}>
            <Text style={styles.value}>{identifier}</Text>
          </View>
          <Chip style={styles.chipWarning} textStyle={styles.chipWarningText}>
            {`${status} (Picked ${statusMessage})`}
          </Chip>
        </View>
        <Divider style={styles.contentDivider} />

        <Subheading style={styles.destinationSubheading}>
          {`Destination: ${destination?.locationNumber} - ${destination?.name}`}
        </Subheading>

        <View style={styles.additionalInfoRow}>
          <Chip icon="calendar" style={styles.chipDefault} textStyle={styles.chipDefaultText}>
            {`Expected Shipping: ${formattedExpectedShippingDate}`}
          </Chip>
        </View>
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
          size="100%"
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
