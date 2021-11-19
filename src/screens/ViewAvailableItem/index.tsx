import {useNavigation, useRoute} from "@react-navigation/native";
import React from "react";
import {Image, View} from "react-native";
import styles from './styles';
import {Card} from "react-native-paper";
import RenderData from "../../components/RenderData";
import Button from "../../components/Button";

const ViewAvailableItem = () => {
    const route = useRoute();
    const navigation = useNavigation()
    const {item, imageUrl}: any = route.params
    const navigateToAdjustStock = () => {
        navigation.navigate('AdjustStock', {item});
    }
    const navigateToTransfer = () => {
        navigation.navigate('InternalTransfer', {item});
    }
    return (
        <View style={styles.container}>
            <Card style={styles.from}>
                <Card.Content>
                    <View style={{width: '100%', alignItems: 'center', flex: 0}}>
                        <Image
                            style={{width: 150, height: 150, resizeMode: 'contain'}}
                            source={{uri: imageUrl}}
                        />
                    </View>
                    <View style={styles.rowItem}>
                        <RenderData title={"Product Code"} subText={item?.product.productCode}/>
                        <RenderData title={"Product Name"} subText={item?.product.name}/>
                    </View>
                    <View style={styles.rowItem}>
                        <RenderData title={"Lot Number"} subText={item?.inventoryItem.lotNumber ?? "Default"}/>
                        <RenderData title={"Expiration Date"} subText={item?.inventoryItem.expirationDate ?? "Never"}/>
                    </View>
                    <View style={styles.rowItem}>
                        <RenderData title={"Quantity On Hand"} subText={item?.quantityOnHand}/>
                        <RenderData title={"Quantity Available"} subText={item.quantityAvailableToPromise}/>
                    </View>
                    <View style={styles.rowItem}>
                        <RenderData title={"Quantity Allocated"} subText={item?.quantityAllocated ?? "0"}/>
                        <RenderData title={"Quantity On Order"} subText={item.quantityOnOrder ?? "0"}/>
                    </View>
                </Card.Content>
            </Card>
            <View style={styles.button}>
                <Button
                    title={'Adjust Stock'}
                    onPress={navigateToAdjustStock}
                />
                <Button
                    title={'Transfer'}
                    onPress={navigateToTransfer}
                />
            </View>
        </View>
    )
}
export default ViewAvailableItem