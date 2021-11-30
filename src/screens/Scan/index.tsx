import React, {useEffect, useState} from 'react';
import {Text, View} from 'react-native';
import styles from './styles';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigation} from "@react-navigation/native";
import useEventListener from "../../hooks/useEventListener";
import Product from "../../data/product/Product";
import showPopup from "../../components/Popup";
import {searchProductGloballyAction,} from '../../redux/actions/products';
import {hideScreenLoading} from '../../redux/actions/main';
import {getInternalLocationDetails} from "../../redux/actions/locations";
import {RootState} from "../../redux/reducers";

const Scan = () => {
    const barcodeData = useEventListener();
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const location = useSelector((state: RootState) => state.mainReducer.currentLocation)
    const [state, setState] = useState<any>({
        error: null,
        searchProductCode: null,

    });


    useEffect(() => {
        if (barcodeData && Object.keys(barcodeData).length !== 0) {
            onBarCodeScanned(barcodeData.data)
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
        if (query.includes("LOG-XXX")) {
            const actionCallback = (data: any) => {
                if (data?.error) {
                    showPopup({
                        title: data.errorMessage
                            ? `Failed to load search results with value = "${query}"`
                            : "error",
                        message:
                            data.errorMessage ??
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
                        setState({
                            ...state,
                            searchProductCode: {
                                query: query,
                                results: null,
                            },
                            error: `No search results found for product name "${query}"`,
                        });
                    } else {
                        setState({
                            ...state,
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
            dispatch(searchProductGloballyAction(query, actionCallback));
        } else {

            const actionLocationCallback = (data: any) => {
                if (data?.error) {
                    showPopup({
                        title: data.errorMessage
                            ? `Failed to load search results with value = "${query}"`
                            : null,
                        message:
                            data.errorMessage ??
                            `Failed to load search results with value = "${query}"`,
                        positiveButton: {
                            text: 'Retry',
                            callback: () => {
                                dispatch(getInternalLocationDetails(query, location.id, actionLocationCallback));
                            },
                        },
                        negativeButtonText: 'Cancel',
                    });
                } else {
                    if (data.length == 0) {
                        showPopup({
                            message: `No search results found for Location name "${query}"`,
                            positiveButton: {text: 'Ok'},
                        });
                    } else {
                        console.log(data)
                        if (data && Object.keys(data).length !== 0) {
                            navigateToLocationDetails(query)
                        }
                    }
                    dispatch(hideScreenLoading());
                }
            };
            dispatch(getInternalLocationDetails(query, location.id, actionLocationCallback));
        }
    };

    const RenderItem = ({title, subTitle}: any) => {
        return (
            <View style={styles.columnItem}>
                <Text style={styles.label}>{title}</Text>
                <Text style={styles.value}>{subTitle}</Text>
            </View>)
    }

    const navigateToProduct = (product: Product | undefined) => {
        if (product) { // @ts-ignore
            navigation.navigate('ProductDetails', {product})
        }
    }
    const navigateToLocationDetails = (id: string | undefined) => {
        if (id) { // @ts-ignore
            navigation.navigate('InternalLocationDetail', {id})
        }
    }
    return (
        <View style={styles.screenContainer}>
            <View style={styles.countLabelAndIconContainer}>
                {barcodeData && <Text style={styles.countLabel}>{JSON.stringify(barcodeData?.data)}</Text>}
            </View>
        </View>);

}


export default Scan;
