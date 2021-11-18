import {
  ListRenderItemInfo,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {ReactElement} from 'react';
import Theme from '../../utils/Theme';
import {Order} from '../../data/order/Order';
import { SwipeListView } from 'react-native-swipe-list-view';

export interface Props {
  orders: Order[] | null;
  onOrderTapped: (order: Order) => void;
}

export default function OrdersList(props: Props) {
  return (
    <SwipeListView
        data={props.orders}
        renderItem={(item: ListRenderItemInfo<Order>) =>
          renderOrder(item.item, () => props.onOrderTapped(item.item))
        }
        keyExtractor={order => order.id}
        style={styles.list}
        renderHiddenItem={ (item: ListRenderItemInfo<Order>) => (
          <View style={styles.detailContainer}>
            <TouchableOpacity 
              style={styles.detailView} 
              onPress={() => props.onOrderTapped(item.item)}
            >
              <Text style={styles.detailText}>Detail</Text>
            </TouchableOpacity>
            <View style={styles.leftView} />
          </View>
        )}
        leftOpenValue={95}
        disableLeftSwipe={true}
        rightOpenValue={-95}
        stopRightSwipe={10}
    />
  );
}

function renderOrder(order: Order, onOrderTapped: () => void): ReactElement {
  return (
    <TouchableOpacity
      style={styles.listItemContainer}
      onPress={() => onOrderTapped()}>
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
          <Text style={styles.label}>Name</Text>
          <Text style={styles.value}>{order.name}</Text>
        </View>
        <View style={styles.col50}>
          <Text style={styles.label}>Requested Delivery Date</Text>
          <Text style={styles.value}>{order.requestedDeliveryDate}</Text>
        </View>
      </View>
      <View style={styles.row}>
        <View style={styles.col50}>
          <Text style={styles.label}>Origin</Text>
          <Text style={styles.value}>{order.origin?.name}</Text>
        </View>
        <View style={styles.col50}>
          <Text style={styles.label}>Destination</Text>
          <Text style={styles.value}>{order.destination?.name}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  list: {
    width: '100%',
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
    justifyContent: 'center',
  },
  listItemNameContainer: {
    display: 'flex',
    flexDirection: 'column',
    flex: 0,
    marginStart: 4,
  },
  listItemNameLabel: {
    fontSize: 12,
    color: Theme.colors.placeholder,
  },
  listItemName: {
    fontSize: 16,
    color: Theme.colors.text,
  },
  listItemCategoryContainer: {
    display: 'flex',
    flexDirection: 'column',
    flex: 0,
    marginStart: 4,
    marginTop: 4,
  },
  listItemCategoryLabel: {
    fontSize: 12,
    color: Theme.colors.placeholder,
  },
  listItemCategory: {
    fontSize: 16,
    color: Theme.colors.text,
  },
  row: {
    flexDirection: 'row',
    borderColor: Theme.colors.background,
    // borderBottomWidth: 1,
    marginTop: 1,
    padding: 2,
    width: '100%',
  },
  col50: {
    display: 'flex',
    flexDirection: 'column',
    flex: 0,
    marginStart: 4,
    width: '50%',
  },
  label: {
    fontSize: 12,
    color: Theme.colors.placeholder,
  },
  value: {
    fontSize: 16,
    color: Theme.colors.text,
  },
  detailContainer: {
    flex: 1,
    flexDirection: 'row'
  },
  detailView: {
    flex: 0.2,
    marginVertical: 6,
    marginLeft: 6,
    padding: 4,
    borderWidth:1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: Theme.roundness,
    borderColor: Theme.colors.backdrop,
  },
  leftView: {
    flex: 0.8
  },
  detailText: {
    fontSize: 14,
    color: Theme.colors.text,
  }
});
