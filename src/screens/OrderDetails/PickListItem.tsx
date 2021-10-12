import React, {Component} from 'react';
import styles from './styles';
import {Text, TouchableOpacity, View} from 'react-native';

interface Props {
  item: any;
  onPress: any;
}

class PickListItem extends Component<Props> {
  render() {
    const {item} = this.props;
    return (
      <TouchableOpacity
        style={styles.listItemContainer}
        onPress={this.props.onPress}>
        <View style={styles.row}>
          <View style={styles.col50}>
            <Text style={styles.label}>Product Code</Text>
            <Text style={styles.value}>{item.productCode}</Text>
          </View>
          <View style={styles.col50}>
            <Text style={styles.label}>Product Name</Text>
            <Text style={styles.value}>{item.product.name}</Text>
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.col50}>
            <Text style={styles.label}>Lot</Text>
            <Text style={styles.value}>{item.lotNumber}</Text>
          </View>
          <View style={styles.col50}>
            <Text style={styles.label}>Expiry</Text>
            <Text style={styles.value}>{item.expirationDate}</Text>
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.col50}>
            <Text style={styles.label}>Qty Required</Text>
            <Text style={styles.value}>{item.quantityRequired}</Text>
          </View>
          <View style={styles.col50}>
            <Text style={styles.label}>Qty Picked</Text>
            <Text style={styles.value}>{item.quantityPicked}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }
}

export default PickListItem;
