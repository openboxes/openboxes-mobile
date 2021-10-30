import React from "react";
import {SectionList, View, Text, TouchableOpacity, FlatList} from "react-native";
import {useNavigation} from "@react-navigation/native";
import styles from "./styles";
import {Card} from "react-native-paper";
import InboundDetailProps from "./types";

const InboundOrderContainer = ({data, shipmentData}: InboundDetailProps) => {
    const navigation = useNavigation<any>();

    const RenderData = ({title, subText}: any): JSX.Element => {
        return (
            <View style={styles.columnItem}>
                <Text style={styles.label}>{title}</Text>
                <Text style={styles.value}>{subText}</Text>
            </View>
        )
    }

    const navigateToInboundOrderDetails = () => {
        navigation.navigate("InboundOrderDetails")
    }

    const renderShipmentItem = (): JSX.Element => {
        return (<View
            style={styles.itemView}>
            <Card>
                <Card.Content>
                    <View style={styles.rowItem}>
                        <Text style={styles.value}>{shipmentData?.name}</Text>
                    </View>
                    <View style={styles.rowItem}>
                        <RenderData title={"Origin"} subText={shipmentData?.origin.name}/>
                        <RenderData title={"Status"} subText={shipmentData?.status}/>
                    </View>
                    <View style={styles.rowItem}>
                        <RenderData title={"Destination"} subText={shipmentData?.destination.name}/>
                        <RenderData title={"Number of Items"} subText={shipmentData?.shipmentItems.length}/>
                    </View>
                    <View style={styles.rowItem}>
                        <RenderData title={"Expected Shipping Date"} subText={shipmentData?.expectedShippingDate}/>
                        <RenderData title={"Expected Delivery Date"} subText={shipmentData?.expectedDeliveryDate}/>
                    </View>
                </Card.Content>
            </Card>
        </View>);
    }

    const getStatus = (value: number) => {
        if (value > 0) {
            return "Receiving";
        } else if (value <= 0) {
            return "Received";
        } else return "Pending";
    }

    const renderListItem = ({item}: any): JSX.Element => {
        return (<TouchableOpacity
            onPress={navigateToInboundOrderDetails}
            style={styles.itemView}>
            <Card>
                <Card.Content>
                    <View style={styles.rowItem}>
                        <RenderData title={"Product Code"} subText={item['product.productCode']}/>
                        <RenderData title={"Product Name"} subText={item["product.name"]}/>
                    </View>
                    <View style={styles.rowItem}>
                        <RenderData title={"Quantity Shipped"} subText={item.quantityShipped}/>
                        <RenderData title={"Quantity Received"} subText={item.quantityReceived}/>
                    </View>
                    <View style={styles.rowItem}>
                        <RenderData title={"Quantity Remaining"} subText={item.quantityRemaining}/>
                        <RenderData title={"Status"} subText={getStatus(item.quantityRemaining)}/>
                    </View>
                </Card.Content>
            </Card>
        </TouchableOpacity>)
    }

    return (
        <SectionList
            ListHeaderComponent={renderShipmentItem}
            renderItem={renderListItem}
            renderSectionHeader={({section: {title}}) => (
                <Text style={styles.headerTitle}>{title}</Text>
            )}
            sections={data}
            keyExtractor={(item, index) => item + index}
        />
    );
}
export default InboundOrderContainer;