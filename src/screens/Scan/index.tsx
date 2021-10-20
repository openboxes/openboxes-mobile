import React, {useEffect, useState} from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import Header from '../../components/Header';
import styles from './styles';
// import Header from '../../components/Header';
import {connect, useDispatch} from 'react-redux';
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
    const dispatch = useDispatch();
    const [state,setState]= useState<any>(   {
        error: null,
        searchProductCode: null,

    });
    useEffect(() => {
        if (barcodeData && Object.keys(barcodeData).length !== 0) {
           onBarCodeScanned(barcodeData.data)
        }
    },[barcodeData])


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
                           dispatch(searchProductGloballyAction(query, actionCallback));
                        },
                    },
                    negativeButtonText: 'Cancel',
                });
            } else {
                if (data.length == 0) {
                    setState({...state,
                        searchProductCode: {
                            query: query,
                            results: null,
                        },
                        error: `No search results found for product name "${query}"`,
                    });
                } else {
                    setState({...state,
                        searchProductCode: {
                            query: query,
                            results: data,
                        },
                        error: null,
                    });
                    if (data && Object.keys(data).length !== 0) {
                        navigateToProduct(data.data[0])
                    }
                }
                hideScreenLoading();
            }
        };

        dispatch( searchProductGloballyAction(query, actionCallback));
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
    const navigateToProduct = (product: Product | undefined) => {
        if(product)
            { // @ts-ignore
                navigation.navigate('ProductDetails', {product})
            }

    }
    return (
        <View style={styles.screenContainer}>
            <View style={styles.countLabelAndIconContainer}>
                { barcodeData && <Text style={styles.countLabel}>{JSON.stringify(barcodeData?.data)}</Text>}
            </View>
        </View>
    );

}


export default Scan;
