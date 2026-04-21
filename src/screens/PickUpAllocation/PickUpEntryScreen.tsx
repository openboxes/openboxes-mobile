import React, { useCallback, useState } from 'react';
import { Alert, FlatList, TouchableOpacity, View } from 'react-native';
import { Caption, Card, Chip, Divider, Paragraph, Title } from 'react-native-paper';

import ListLoadingSkeleton from '../../components/ListLoadingSkeleton';
import { navigate } from '../../NavigationService';
import { getOutboundOrders } from '../../apis/pua';
import { useFocusEffect } from '@react-navigation/native';

import PickUpCardSkeleton from './PickUpCardSkeleton';
import styles from './styles';
import { AllocationOrder } from './types';

export function PickUpEntryScreen() {
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [hasLoaded, setHasLoaded] = useState<boolean>(false);

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      const response = await getOutboundOrders();
      setOrders(response.data || []);
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch orders data');
    } finally {
      setIsLoading(false);
      setHasLoaded(true);
    }
  };

  // useFocusEffect usedto refresh when screen is focused after nagivation
  useFocusEffect(
    useCallback(() => {
      fetchOrders();
    }, [])
  );

  const showSkeleton = isLoading && !hasLoaded;

  return (
    <View style={styles.screenContainer}>
      <Title style={styles.titleText}>Outstanding Orders ({orders.length})</Title>
      <Paragraph style={styles.subtitleText}>
        Select an order from the list to start the pick-up allocation process.
      </Paragraph>

      <Divider style={styles.sectionDivider} />

      {showSkeleton ? (
        <ListLoadingSkeleton visible count={5} CardComponent={PickUpCardSkeleton} />
      ) : (
        <FlatList
          data={orders}
          renderItem={({ item }) => <PickUpCard order={item} />}
          keyExtractor={(item: AllocationOrder) => item.id}
          numColumns={1}
          ItemSeparatorComponent={() => <View style={styles.itemSeparator} />}
          refreshing={isLoading}
          onRefresh={fetchOrders}
        />
      )}
    </View>
  );
}

function PickUpCard({ order }: { order: AllocationOrder }) {
  const onPress = () => navigate('PickUpOrderScreen', { orderId: order.id });

  return (
    <TouchableOpacity activeOpacity={0.85} style={styles.cardTouchable} onPress={onPress}>
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.cardHeader}>
            <Chip icon="identifier" textStyle={styles.chipText} style={styles.chip}>
              {order.identifier}
            </Chip>
            <Chip icon="package" textStyle={styles.chipText} style={styles.chip}>
              {`Lines: ${order.lineItemCount}`}
            </Chip>
          </View>

          <Divider style={styles.cardDivider} />

          <Title>{order.name}</Title>
          <Caption>
            {`Order Date: ${new Date(order.dateTimeCreated).toLocaleDateString('en-US', {
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
