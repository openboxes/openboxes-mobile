import React, {useEffect} from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import Header from '../../components/Header';
import styles from './styles';
// import Header from '../../components/Header';
import {connect} from 'react-redux';
// import Icon, {Name} from '../../Icon';

import {RootState} from '../../redux/reducers';
import {useNavigation} from "@react-navigation/native";
import useEventListener from "../../hooks/useEventListener";
// import {Order} from "../../data/order/Order";
// import Product from "../../data/product/Product";
// import Products from "../Products";

const Scan = () => {
    const barcodeData = useEventListener();
    // const navigation = useNavigation();
    // useEffect(() => {
    //     if (barcodeData && barcodeData?.data === "LOG-XXX-BED")
    //         navigateToOrder(getOrder(barcodeData?.data))
    //     else if(barcodeData && barcodeData?.data === "LOG-XXX-BAR")
    //         navigateToProduct(getProduct(barcodeData?.data))
    // }, [barcodeData])

    // const getOrder =(barCode : string):Order | null=>{
    //     return null
    // }
    // const getProduct =(barCode : string):Product | null =>{
    //     return null
    // }
    // const navigateToOrder = (order: Order) => {
    //     navigation.navigate(`OrderDetails`, {
    //         order,
    //         pickList: null,
    //         exit: () => {
    //             navigation.navigate('Dashboard');
    //         },
    //     })
    // }
    // const navigateToProduct = (product : Product) => {
    //     navigation.navigate('ProductDetails', {product})
    // }
    return (
        <View style={styles.screenContainer}>
            <View style={styles.countLabelAndIconContainer}>
                <Text style={styles.countLabel}>{JSON.stringify(barcodeData)}</Text>
            </View>
        </View>
    );

}


export default Scan;
