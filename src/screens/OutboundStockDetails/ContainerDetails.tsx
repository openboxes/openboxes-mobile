import React from 'react';
import styles from './styles';
import {SectionList, Text, TouchableOpacity, View} from 'react-native';
import {Container} from "../../data/container/Container";
import {useNavigation} from "@react-navigation/native";
import {Card} from "react-native-paper";

interface Props {
    item: Container;
    onPress: any | null;
    navigation: any | null;
}

const ContainerDetails = ({item}: any) => {
    const navigation = useNavigation<any>();

    const RenderData = ({title, subText}: any): JSX.Element => {
        return (
            <View style={styles.columnItem}>
                <Text style={styles.label}>{title}</Text>
                <Text style={styles.value}>{subText}</Text>
            </View>
        )
    }

    const navigateToInboundOrderDetails = (item: any) => {
        navigation.navigate("ShipmentDetails", {item: item.item})
    }


    const renderListItem = (item: any, index: any) => {
        return (<TouchableOpacity
            key={index}
            onPress={() => navigateToInboundOrderDetails(item)}
            style={styles.itemView}>
            <Card>
                <Card.Content>
                    <View style={styles.rowItem}>
                        <RenderData title={"Product Code"} subText={item.inventoryItem.product?.productCode}/>
                        <RenderData title={"Product Name"} subText={item.inventoryItem.product?.name}/>
                    </View>
                    <View style={styles.rowItem}>
                        <RenderData title={"Lot Number"} subText={item.inventoryItem.lotNumber ?? 'Default'}/>
                        <RenderData title={"Expiration Date"} subText={item.inventoryItem.expirationDate ?? 'N/A'}/>
                    </View>
                    <View style={styles.rowItem}>
                        <RenderData title={"Quantity"} subText={item.quantity}/>
                    </View>
                </Card.Content>
            </Card>
        </TouchableOpacity>)
    }

    return (
        <SectionList
            renderItem={({item, index, section}) => renderListItem(item, index)}
            renderSectionHeader={({section: {title}}) => (
                <Text style={styles.headerTitle}>{title}</Text>
            )}
            sections={item}
            keyExtractor={(item, index) => item + index}
        />
    );
}
export default ContainerDetails
