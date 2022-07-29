import { ListRenderItemInfo, FlatList } from 'react-native';
import React, { ReactElement } from 'react';
import { Order } from '../../data/order/Order';
import EmptyView from '../../components/EmptyView';
import { Card } from 'react-native-paper';
import { common } from '../../assets/styles';
import { OrderListProps as Props } from './types';
import { Props as LabeledDataType } from '../../components/LabeledData/types';
import DetailsTable from '../../components/DetailsTable';

export default function OrdersList(props: Props) {
  function renderOrder(item: ListRenderItemInfo<Order>): ReactElement {
    const order = item.item;
    const renderOrderDats: LabeledDataType[] = [
      { label: 'Identifier', value: order.identifier },
      { label: 'Status Code', value: order.statusCode },
      { label: 'Destination', value: order.destination?.name },
      { label: 'Expected Shipping Date', value: order.expectedShippingDate },
      { label: 'Packing Location', value: order?.packingLocation?.name, defaultValue: 'Unassigned' },
      { label: 'Loading Location', value: order?.loadingLocation?.name, defaultValue: 'Unassigned' }
    ];
    return (
      <Card style={common.listItemContainer} onPress={() => props.onOrderTapped(order)}>
        <Card.Content>
          <DetailsTable data={renderOrderDats} />
        </Card.Content>
      </Card>
    );
  }

  return (
    props.orders && (
      <FlatList
        data={props.orders}
        renderItem={renderOrder}
        ListEmptyComponent={<EmptyView title="Picking" description="There are no items to pick" />}
        keyExtractor={(order) => order.id}
      />
    )
  );
}
