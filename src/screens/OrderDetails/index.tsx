import _ from 'lodash';
import React from 'react';
import { connect } from 'react-redux';
import { Alert, ScrollView, Text, View } from 'react-native';

import styles from './styles';
import { showScreenLoading, hideScreenLoading } from '../../redux/actions/main';
import { orderDetailsVMMapper } from './OrderDetailsVMMapper';
import { getPickListAction } from '../../redux/actions/orders';
import { State, DispatchProps, Props } from './types';
import PickOrderItem from '../PickList';

class OrderDetails extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      pickList: null,
      error: null,
      initialPicklistItemIndex: 0
    };
  }

  componentDidMount() {
    this.getOrderDetails();
  }

  getOrderDetails() {
    this.props.showScreenLoading('Loading');
    const { order } = this.props.route.params;

    const actionCallback = (data: any) => {
      if (data?.length === 0) {
        this.props.hideScreenLoading();
        this.setState({
          pickList: data,
          error: 'No Picklist found'
        });
      } else {
        const initialPicklistItemIndex = this.getInitiallyDisplayedPickItemIndex(data?.picklistItems);

        if (initialPicklistItemIndex === -1) {
          Alert.alert(
            'All items are picked', // title
            'What do you want to do now?', // message
            [{ // button list
              text: 'Go back',
              onPress: () =>
                this.props.navigation.navigate('Orders', {
                  refetchOrders: true
                })
            },
            {
              text: 'Move to Packing',
              onPress: () =>
                this.props.navigation.navigate('PackingLocationPage', {
                  orderId: order?.id,
                  packingLocation: order?.packingLocation
                })
            },
              {
                text: 'View',
                onPress: () => null
              }],
            {
              cancelable: false
            },
          );
        }

        this.setState(
          {
            pickList: null,
            error: null,
            initialPicklistItemIndex: 0
          },
          () =>
            this.setState(
              {
                pickList: {
                  ...data,
                  picklistItems: _.map(data.picklistItems, (item: any) => ({
                    ...item,
                    quantityToPick: item.quantityRemaining
                  }))
                },
                error: null,
                initialPicklistItemIndex
              },
              () => this.props.hideScreenLoading()
            )
        );
      }
    };

    this.props.getPickListAction(order?.picklist?.id, actionCallback);
  }

  getInitiallyDisplayedPickItemIndex(picklistItems: any) {
    return _.findIndex(picklistItems, (item: any) => Number(item.quantityRemaining) > 0);
  }

  render() {
    const { initialPicklistItemIndex, pickList } = this.state;

    const vm = orderDetailsVMMapper(this.props.route?.params, this.state);
    return (
      <ScrollView style={styles.screenContainer}>
        <View style={styles.contentContainer}>
          <View style={styles.row}>
            <View style={styles.col50}>
              <Text style={styles.label}>Identifier</Text>
              <Text style={styles.value}>{vm.identifier}</Text>
            </View>
            <View style={styles.col50}>
              <Text style={styles.label}>Status</Text>
              <Text style={styles.value}>{vm.status}</Text>
            </View>
          </View>
          <View style={styles.row}>
            <View style={styles.col50}>
              <Text style={styles.label}>Destination</Text>
              <Text style={styles.value}>
                {vm.destination.locationNumber}-{vm.destination.name}
              </Text>
            </View>
            <View style={styles.col50}>
              <Text style={styles.label}>Expected Shipping Date</Text>
              <Text style={styles.value}>{vm.expectedShippingDate}</Text>
            </View>
          </View>
          <View style={styles.bottomList}>
            {pickList?.picklistItems && pickList?.picklistItems?.length > 0 && (
              <PickOrderItem
                pickList={pickList}
                pickListItem={pickList?.picklistItems[initialPicklistItemIndex]}
                selectedPinkItemIndex={initialPicklistItemIndex}
                successfulPickCallback={() => this.getOrderDetails()}
              />
            )}
          </View>
        </View>
      </ScrollView>
    );
  }
}

const mapDispatchToProps: DispatchProps = {
  getPickListAction,
  showScreenLoading,
  hideScreenLoading
};

export default connect(null, mapDispatchToProps)(OrderDetails);
