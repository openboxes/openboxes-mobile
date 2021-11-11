import {View} from 'react-native';
import {TouchableOpacity, Text} from 'react-native';
import React from 'react';
import {Props} from './types';
import styles from './styles';

export default function PutAwayItem(props: Props) {
  const {item, onItemTapped} = props;
  return (
    <TouchableOpacity style={styles.listItemContainer} onPress={onItemTapped}>
      <View style={styles.row}>
        <View style={styles.col50}>
          <Text style={styles.label}>Id</Text>
          <Text style={styles.value}>{item['stockMovement.name']}</Text>
        </View>
        <View style={styles.col50}>
          <Text style={styles.label}>Product Name</Text>
          <Text style={styles.value}>{item['product.name']}</Text>
        </View>
      </View>
      <View style={styles.row}>
        <View style={styles.col50}>
          <Text style={styles.label}>Current Location</Text>
          <Text style={styles.value}>{item['currentLocation.name']}</Text>
        </View>
        <View style={styles.col50}>
          <Text style={styles.label}>Putaway Location</Text>
          <Text style={styles.value}>{item['putawayLocation.name']}</Text>
        </View>
      </View>
      <View style={styles.row}>
        <View style={styles.col50}>
          <Text style={styles.label}>Qty</Text>
          <Text style={styles.value}>{item.quantity}</Text>
        </View>
        <View style={styles.col50}>
          <Text style={styles.label}>Qty Available</Text>
          <Text style={styles.value}>{item.quantityAvailable}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}
