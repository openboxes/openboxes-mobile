import React from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import InboundOrderProps from './types';
import { Card } from 'react-native-paper';
import styles from './styles';
import { useNavigation } from '@react-navigation/native';
import EmptyView from '../../components/EmptyView';
const InboundOrderList = ({ data }: InboundOrderProps) => {
  const navigation = useNavigation<any>();

  const RenderOrderData = ({ title, subText }: any): JSX.Element => {
    return (
      <View style={styles.columnItem}>
        <Text style={styles.label}>{title}</Text>
        <Text style={styles.value}>{subText}</Text>
      </View>
    );
  };

  const navigateToInboundDetails = (item: any) => {
    navigation.navigate('InboundDetails', { shipmentDetails: item });
  };

  const RenderListItem = ({ item, index }: any): JSX.Element => {
    return (
      <TouchableOpacity
        onPress={() => navigateToInboundDetails(item)}
        style={styles.itemView}
        key={index}
      >
        <Card>
          <Card.Content>
            <View style={styles.rowItem}>
              <RenderOrderData
                title={'Identifier'}
                subText={item.shipmentNumber}
              />
              <RenderOrderData title={'Status'} subText={item.status} />
            </View>
            <View style={styles.rowItem}>
              <RenderOrderData title={'Origin'} subText={item.origin.name} />
              <RenderOrderData
                title={'Destination'}
                subText={item.destination.name}
              />
            </View>
            <View style={styles.rowItem}>
              <RenderOrderData title={'Description'} subText={item.name} />
              <RenderOrderData
                title={'Number of Items'}
                subText={item.shipmentItems.length}
              />
            </View>
          </Card.Content>
        </Card>
      </TouchableOpacity>
    );
  };
  return data.length > 0 ? (
    <FlatList
      data={data}
      keyExtractor={(item, index) => item + index}
      renderItem={RenderListItem}
    />
  ) : (
    <EmptyView title="Receiving" description="There are no items to receive" />
  );
};
export default InboundOrderList;
