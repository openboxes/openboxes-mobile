import React, {Component} from 'react';
import styles from './styles';
import {Text, TouchableOpacity, View} from 'react-native';
import {PicklistItem} from "../../data/picklist/PicklistItem";
import ShipmentItems from "../../data/inbound/ShipmentItems";
import {ContainerShipmentItem} from "../../data/container/ContainerShipmentItem";

interface Props {
    item: ContainerShipmentItem;
    onPress: any | null;
}

class ShipmentItemList extends Component<Props> {
    render() {
        const {item} = this.props;
        return (
            <TouchableOpacity
                style={styles.listItemContainer}
                onPress={this.props.onPress}>
                <View style={styles.row}>
                    <View style={styles.col50}>
                        <Text style={styles.label}>Product Code</Text>
                        <Text style={styles.value}>{item.inventoryItem.product?.productCode}</Text>
                    </View>
                    <View style={styles.col50}>
                        <Text style={styles.label}>Product Name</Text>
                        <Text style={styles.value}>{item.inventoryItem.product?.name}</Text>
                    </View>
                </View>
                <View style={styles.row}>
                    <View style={styles.col50}>
                        <Text style={styles.label}>Lot Number</Text>
                        <Text style={styles.value}>{item.inventoryItem.lotNumber ? item.inventoryItem.lotNumber : 'Default'}</Text>
                    </View>
                    <View style={styles.col50}>
                        <Text style={styles.label}>Expiration Date</Text>
                        <Text style={styles.value}>{item.inventoryItem.expirationDate ? item.inventoryItem.expirationDate : 'N/A'}</Text>
                    </View>
                </View>
                <View style={styles.row}>
                    <View style={styles.col50}>
                        <Text style={styles.label}>Quantity</Text>
                        <Text style={styles.value}>{item.quantity}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        );
    }
}

export default ShipmentItemList;
