import React, { ReactElement } from 'react';
import { FlatList, ListRenderItemInfo, StyleSheet, Text, View } from 'react-native';
import { Card, Chip, Divider, Subheading } from 'react-native-paper';

import { LayoutStyle } from '../../assets/styles';
import EmptyView from '../../components/EmptyView';
import { HYPHEN } from '../../constants';
import { Order } from '../../data/order/Order';
import Theme from '../../utils/Theme';
import { parseDateToISODate, parseFromISODateToLocaleString } from '../../utils/utils';

export interface Props {
  orders: Order[] | null;
  onOrderTapped: (order: Order) => void;
  emptyDescription?: string;
}

export default function OrdersList(props: Props) {
  return props.orders ? (
    <FlatList
      data={props.orders}
      keyboardShouldPersistTaps="handled"
      keyboardDismissMode="on-drag"
      renderItem={(item: ListRenderItemInfo<Order>) => renderOrder(item.item, () => props.onOrderTapped(item.item))}
      ListEmptyComponent={
        <EmptyView title="Orders" description={props.emptyDescription ?? 'No outbound orders found'} />
      }
      keyExtractor={(order) => order.id}
      style={styles.list}
    />
  ) : null;
}

function renderOrder(order: Order, onOrderTapped: () => void): ReactElement {
  const parsedExpectedShippingDate = parseDateToISODate(order?.expectedShippingDate || '');
  const formattedExpectedShippingDate = parseFromISODateToLocaleString(parsedExpectedShippingDate);

  return (
    <Card style={LayoutStyle.listItemContainer} onPress={() => onOrderTapped()}>
      <Card.Content>
        <View style={styles.headerRow}>
          <View style={styles.dividedValues}>
            <Text style={styles.value}>{order.identifier}</Text>
          </View>
          <Chip style={styles.chipWarning} textStyle={styles.chipWarningText}>
            {order.statusCode}
          </Chip>
        </View>
        <Divider style={styles.dividerHorizontal} />

        <Subheading style={styles.subheading}> {`Destination: ${order.destination?.name}`} </Subheading>
        <View style={styles.additionalInfoRow}>
          <Chip icon="calendar" style={styles.chipDefault} textStyle={styles.chipDefaultText}>
            {`Expected Shipping: ${formattedExpectedShippingDate}`}
          </Chip>
        </View>
        <Divider style={styles.dividerHorizontal} />

        <View style={styles.rowItem}>
          <View style={styles.columnItem}>
            <Text style={styles.label}>Packing Location</Text>
            <Text style={styles.value}>{order.packingLocation?.name ?? HYPHEN}</Text>
          </View>

          <View style={styles.columnItem}>
            <Text style={styles.label}>Loading Location</Text>
            <Text style={styles.value}>{order.loadingLocation?.name ?? HYPHEN}</Text>
          </View>
        </View>
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  list: {
    width: '100%'
  },
  chipWarning: {
    height: 24,
    justifyContent: 'center',
    borderRadius: 4,
    alignItems: 'center',
    backgroundColor: Theme.colors.warning
  },
  chipWarningText: {
    fontSize: 12,
    color: Theme.colors.text
  },
  chipDefault: {
    height: 24,
    justifyContent: 'center',
    borderRadius: 4,
    alignItems: 'center',
    marginRight: 8
  },
  chipDefaultText: {
    fontSize: 12,
    color: Theme.colors.text
  },
  dividerHorizontal: {
    marginVertical: 8
  },
  additionalInfoRow: {
    flexDirection: 'row',
    marginTop: 8
  },
  rowItem: {
    flexDirection: 'row',
    borderColor: Theme.colors.background,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  value: {
    fontSize: 12,
    color: Theme.colors.text
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  dividedValues: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  subheading: {
    fontWeight: 'bold'
  },
  columnItem: {
    display: 'flex',
    flexDirection: 'column',
    flex: 0,
    justifyContent: 'space-between'
  },
  label: {
    fontSize: 10,
    color: Theme.colors.placeholder
  }
});
