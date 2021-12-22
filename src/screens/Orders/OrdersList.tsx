/* eslint-disable react-native/no-unused-styles */
import {
  ListRenderItemInfo,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  FlatList
} from 'react-native';
import React, { ReactElement } from 'react';
import Theme from '../../utils/Theme';
import { Order } from '../../data/order/Order';
import EmptyView from '../../components/EmptyView';
export interface Props {
  orders: Order[] | null;
  onOrderTapped: (order: Order) => void;
}

export default function OrdersList(props: Props) {
  return props.orders ? (
    <FlatList
      data={props.orders}
      renderItem={(item: ListRenderItemInfo<Order>) =>
        renderOrder(item.item, () => props.onOrderTapped(item.item))
      }
      ListEmptyComponent={
        <EmptyView title="Picking" description="There are no items to pick" />
      }
      keyExtractor={(order) => order.id}
      style={styles.list}
    />
  ) : null;
}

function renderOrder(order: Order, onOrderTapped: () => void): ReactElement {
  return (
    <TouchableOpacity
      style={styles.listItemContainer}
      onPress={() => onOrderTapped()}
    >
      <View style={styles.row}>
        <View style={styles.col50}>
          <Text style={styles.label}>Identifier</Text>
          <Text style={styles.value}>{order.identifier}</Text>
        </View>
        <View style={styles.col50}>
          <Text style={styles.label}>Status Code</Text>
          <Text style={styles.value}>{order.statusCode}</Text>
        </View>
      </View>
      <View style={styles.row}>
        <View style={styles.col50}>
          <Text style={styles.label}>Destination</Text>
          <Text style={styles.value}>{order.destination?.name}</Text>
        </View>
        <View style={styles.col50}>
          <Text style={styles.label}>Requested Delivery Date</Text>
          <Text style={styles.value}>{order.requestedDeliveryDate}</Text>
        </View>
      </View>
      <View style={styles.row} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  list: {
    width: '100%'
  },
  listItemContainer: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    borderRadius: Theme.roundness,
    backgroundColor: Theme.colors.background,
    borderColor: Theme.colors.backdrop,
    borderWidth: 1,
    margin: 4,
    padding: 4,
    justifyContent: 'center'
  },
  listItemNameContainer: {
    display: 'flex',
    flexDirection: 'column',
    flex: 0,
    marginStart: 4
  },
  listItemNameLabel: {
    fontSize: 12,
    color: Theme.colors.placeholder
  },
  listItemName: {
    fontSize: 16,
    color: Theme.colors.text
  },
  listItemCategoryContainer: {
    display: 'flex',
    flexDirection: 'column',
    flex: 0,
    marginStart: 4,
    marginTop: 4
  },
  listItemCategoryLabel: {
    fontSize: 12,
    color: Theme.colors.placeholder
  },
  listItemCategory: {
    fontSize: 16,
    color: Theme.colors.text
  },
  row: {
    flexDirection: 'row',
    borderColor: Theme.colors.background,
    marginTop: 1,
    padding: 2,
    width: '100%'
  },
  col50: {
    display: 'flex',
    flexDirection: 'column',
    flex: 0,
    marginStart: 4,
    width: '50%'
  },
  label: {
    fontSize: 12,
    color: Theme.colors.placeholder
  },
  value: {
    fontSize: 16,
    color: Theme.colors.text
  }
});
