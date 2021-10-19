import React, {useEffect, useState} from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import Header from '../../components/Header';
import styles from './styles';
// import Header from '../../components/Header';
import {connect} from 'react-redux';
// import Icon, {Name} from '../../Icon';

import {RootState} from '../../redux/reducers';
import {useNavigation} from "@react-navigation/native";
import useEventListener from "../../hooks/useEventListener";
import {Order} from "../../data/order/Order";
import Product from "../../data/product/Product";
import Products from "../Products";
import showPopup from "../../components/Popup";
import {
    searchProductGloballyAction,
} from '../../redux/actions/products';
import {showScreenLoading, hideScreenLoading} from '../../redux/actions/main';

const Scan = () => {
    const barcodeData = useEventListener();
    const navigation = useNavigation();
    const [state,setState]= useState<any>(   {
        error: null,
        searchByProductCode: null
    });
    useEffect(() => {
        if (barcodeData && Object.keys(barcodeData).length === 0) {
           onBarCodeScanned(barcodeData?.data)
        }
    }, [barcodeData])


    const onBarCodeScanned = (query: string) => {
        // handleBarcodeScan(barcodeNo);
        if (!query) {
            showPopup({
                message: 'Search query is empty',
                positiveButton: {text: 'Ok'},
            });
            return;
        }

        const actionCallback = (data: any) => {
            console.log(data)
            if (data?.error) {
                showPopup({
                    title: data.error.message
                        ? `Failed to load search results with value = "${query}"`
                        : null,
                    message:
                        data.error.message ??
                        `Failed to load search results with value = "${query}"`,
                    positiveButton: {
                        text: 'Retry',
                        callback: () => {
                            searchProductGloballyAction(query, actionCallback);
                        },
                    },
                    negativeButtonText: 'Cancel',
                });
            } else {
                console.log(data)
                if (data.length == 0) {
                    setState({
                        searchByProductCode: {
                            query: query,
                            results: null,
                        },
                        error: `No search results found for product name "${query}"`,
                    });
                } else {
                    setState({
                        searchByProductCode: {
                            query: query,
                            results: data,
                        },
                        error: null,
                    });
                    if (state.searchByProductCode) {
                        console.log(state)
                        navigateToProduct(state.searchByProductCode?.results)
                    }
                }
                // hideScreenLoading();
            }
        };

        searchProductGloballyAction(query, actionCallback);
    };
    const navigateToOrder = (order: Order) => {
        // navigation.navigate(`OrderDetails`, {
        //     order,
        //     pickList: null,
        //     exit: () => {
        //         navigation.navigate('Dashboard');
        //     },
        // })
    }
    const navigateToProduct = (product: Product) => {
        // navigation.navigate('ProductDetails', {product})
    }
    return (
        <View style={styles.screenContainer}>
            <View style={styles.countLabelAndIconContainer}>
                <Text style={styles.countLabel}>{JSON.stringify(barcodeData)}</Text>
            </View>
        </View>
    );

}


export default Scan;
