import React from "react";
import {View, Text, FlatList, ListRenderItem} from "react-native";
import InboundOrderProps from "./types";
import {Card} from "react-native-paper";
import styles from "./styles";

const InboundOrderList = ({data}: InboundOrderProps) => {


    const RenderOrderData = ({title, subText}: any): JSX.Element => {
        return (
            <View style={styles.columnItem}>
                <Text style={styles.label}>{title}</Text>
                <Text style={styles.value}>{subText}</Text>
            </View>
        )
    }

    const RenderListItem = ({item, index}: any): JSX.Element => {
        return (<View style={styles.itemView} key={index}>
            <Card>
                <Card.Content>
                    <View style={styles.rowItem}>
                        <Text style={styles.label}>{"Name: "}</Text>
                        <Text style={styles.value}>{item.name}</Text>
                    </View>
                    <View style={styles.rowItem}>
                        <RenderOrderData title={"Origin"} subText={item.origin.name}/>
                        <RenderOrderData title={"Status"} subText={item.status}/>
                    </View>
                    <View style={styles.rowItem}>
                        <RenderOrderData title={"Destination"} subText={item.destination.name}/>
                        <RenderOrderData title={"Number of Items"} subText={item.shipmentItems.length}/>
                    </View>
                </Card.Content>
            </Card>
        </View>);
    }
    return (
        <FlatList
            data={data}
            keyExtractor={(item, index) => item + index}
            renderItem={RenderListItem}/>
    );
}
export default InboundOrderList;