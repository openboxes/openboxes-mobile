import React from "react";
import {View, Text, FlatList, TouchableOpacity} from "react-native";
import InboundOrderProps from "./types";
import {Card} from "react-native-paper";
import styles from "./styles";
import {useNavigation} from "@react-navigation/native";

const InboundOrderList = ({data}: InboundOrderProps) => {
    const navigation = useNavigation<any>();

    const RenderOrderData = ({title, subText}: any): JSX.Element => {
        return (
            <View style={styles.columnItem}>
                <Text style={styles.label}>{title}</Text>
                <Text style={styles.value}>{subText}</Text>
            </View>
        )
    }

    const navigateToInboundDetails = () => {
        navigation.navigate("InboundDetails",{shipmentDetails : data[0] })
    }

    const RenderListItem = ({item, index}: any): JSX.Element => {
        return (<TouchableOpacity
            onPress={navigateToInboundDetails}
            style={styles.itemView}
            key={index}>
            <Card>
                <Card.Content>
                    <View style={styles.rowItem}>
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
        </TouchableOpacity>);
    }
    return (
        <FlatList
            data={data}
            keyExtractor={(item, index) => item + index}
            renderItem={RenderListItem}/>
    );
}
export default InboundOrderList;