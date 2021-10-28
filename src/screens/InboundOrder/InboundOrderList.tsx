import React from "react";
import {View, Text, FlatList, ListRenderItem} from "react-native";
import InboundOrderProps from "./types";
import {Card} from "react-native-paper";
import styles from "./styles";

const InboundOrderList = ({data}: InboundOrderProps) => {
    const renderListItem = ({item, index}: any): JSX.Element => {
        return (<View style={styles.itemView} key={index}>
            <Card>
                <Card.Content>
                    <Text>{item.name}</Text>
                    <Text>{item.status}</Text>
                    <Text>{item.origin.name}</Text>
                    <Text>{item.destination.name}</Text>
                    <Text>{item.shipmentItems.length}</Text>
                </Card.Content>
            </Card>
        </View>);
    }
    return (
        <FlatList
            data={data}
            keyExtractor={(item, index) => item + index}
            renderItem={renderListItem}/>
    );
}
export default InboundOrderList;