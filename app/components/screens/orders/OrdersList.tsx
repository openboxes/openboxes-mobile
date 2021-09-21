import {FlatList, ListRenderItemInfo, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import React, {ReactElement} from "react";
import Theme from "../../../utils/Theme";
import {createLogger} from "../../../utils/Logger";
import Order from "../../../data/order/Order";

const logger = createLogger("OrdersList")

export interface Props {
  orders: Order[] | null
  onOrderTapped: (order: Order) => void
}

export default function OrdersList(props: Props) {
  return (
    props.orders
      ?
      <FlatList
        data={props.orders}
        renderItem={(item: ListRenderItemInfo<Order>) => renderOrder(item.item, () => props.onOrderTapped(item.item))}
        keyExtractor={order => order.id}
        style={styles.list}
      />
      :
      null
  )
}

function renderOrder(
  order: Order,
  onOrderTapped: () => void
): ReactElement {
  return (
    <TouchableOpacity
      style={styles.listItemContainer}
      onPress={() => onOrderTapped()}
    >
      <View style={styles.listItemNameContainer}>
        <Text style={styles.listItemNameLabel}>Name</Text>
        <Text style={styles.listItemName}>{order.name}</Text>
      </View>
      <View style={styles.listItemCategoryContainer}>
        <Text style={styles.listItemCategoryLabel}>Description</Text>
        <Text style={styles.listItemCategory}>{order.description}</Text>
      </View>
      <View style={styles.listItemCategoryContainer}>
        <Text style={styles.listItemCategoryLabel}>Origin</Text>
        <Text style={styles.listItemCategory}>{order.origin?.name}</Text>
      </View>
      <View style={styles.listItemCategoryContainer}>
        <Text style={styles.listItemCategoryLabel}>Destination</Text>
        <Text style={styles.listItemCategory}>{order.destination?.name}</Text>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  list: {
    width: "100%"
  },
  listItemContainer: {
    display: "flex",
    flexDirection: "column",
    flex: 1,
    borderRadius: Theme.roundness,
    borderColor: Theme.colors.backdrop,
    borderWidth: 1,
    margin: 4,
    padding: 4,
    justifyContent: "center"
  },
  listItemNameContainer: {
    display: "flex",
    flexDirection: "column",
    flex: 0,
    marginStart: 4,
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
    display: "flex",
    flexDirection: "column",
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
  }
})
