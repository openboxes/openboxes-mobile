import React from 'react';
import { FlatList, TouchableOpacity, View } from 'react-native';
import { Caption, Card, Chip, Divider, Paragraph, Title } from 'react-native-paper';

import { navigate } from '../../NavigationService';
import { MOCKED_ORDERS } from './mock-data';
import styles from './styles';
import { AllocationOrder } from './types';

export function PickUpEntryScreen() {
  return (
    <View style={styles.screenContainer}>
      <Title style={styles.titleText}>Outstanding Orders ({MOCKED_ORDERS.length})</Title>
      <Paragraph style={styles.subtitleText}>
        Select an order from the list to start the pick-up allocation process.
      </Paragraph>

      <Divider style={styles.sectionDivider} />

      <FlatList
        data={MOCKED_ORDERS}
        renderItem={({ item }) => <PickUpCard order={item} />}
        keyExtractor={(item: AllocationOrder) => item.orderNumber}
        numColumns={1}
        ItemSeparatorComponent={() => <View style={styles.itemSeparator} />}
      />
    </View>
  );
}

function PickUpCard({ order }: { order: AllocationOrder }) {
  const onPress = () => navigate('PickUpOrderScreen', { order });

  return (
    <TouchableOpacity activeOpacity={0.85} style={styles.cardTouchable} onPress={onPress}>
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.cardHeader}>
            <Chip icon="identifier" textStyle={styles.chipText} style={styles.chip}>
              {order.orderNumber}
            </Chip>
            <Chip icon="package" textStyle={styles.chipText} style={styles.chip}>
              {`Lines: ${order.orderLines.length}`}
            </Chip>
          </View>

          <Divider style={styles.cardDivider} />

          <Title>{order.name}</Title>
          <Caption>
            {`Order Date: ${new Date(order.orderDate).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: '2-digit',
              hour: '2-digit',
              minute: '2-digit'
            })}`}
          </Caption>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );
}
