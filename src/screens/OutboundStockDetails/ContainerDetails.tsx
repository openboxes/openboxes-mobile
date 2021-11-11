import React, {Component} from 'react';
import styles from './styles';
import {FlatList, ListRenderItemInfo, Text, TouchableOpacity, View} from 'react-native';
import {PicklistItem} from "../../data/picklist/PicklistItem";
import {Container} from "../../data/container/Container";
import ContainerItem from "./ContainerItem";
import ShipmentItems from "../../data/inbound/ShipmentItems";
import ShipmentItemList from "./ContainerItem";

interface Props {
    item: Container;
    onPress: any | null;
}

class ContainerDetails extends Component<Props> {
    render() {
        const {item} = this.props;
        return (
            <TouchableOpacity
                style={styles.listItemContainer}
                onPress={this.props.onPress}>
                <View style={styles.row}>
                    <View style={styles.col50}>
                        <Text style={styles.label}>Container name</Text>
                        <Text style={styles.value}>{item.id ? item.name : 'Unpacked'}</Text>
                    </View>
                    <View style={styles.col50}>
                        <Text style={styles.label}>Container number</Text>
                        <Text style={styles.value}>{item.id ? item?.containerNumber : 'UNPACKED'}</Text>
                    </View>
                </View>
                <View style={styles.row}>
                    <View style={styles.col50}>
                        <Text style={styles.label}>Number of items</Text>
                        <Text style={styles.value}>{item.shipmentItems.length}</Text>
                    </View>
                </View>
                <FlatList
                    data={item.shipmentItems}
                    renderItem={(shipmentItem: ListRenderItemInfo<ShipmentItems>) => (
                        <ShipmentItemList
                            item={shipmentItem.item}
                            // onPress={() => {
                            //     this.onItemTapped(item.item);
                            // }}
                        />
                    )}
                    keyExtractor={item => `${item.id}`}
                    style={styles.list}
                />

            </TouchableOpacity>
        );
    }
}

export default ContainerDetails;
