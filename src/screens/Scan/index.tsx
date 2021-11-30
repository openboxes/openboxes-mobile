import React, {useEffect, useState} from 'react';
import {Text, View} from 'react-native';
import styles from './styles';
import {useDispatch} from 'react-redux';
import {useNavigation} from "@react-navigation/native";
import useEventListener from "../../hooks/useEventListener";
import Product from "../../data/product/Product";
import showPopup from "../../components/Popup";
import {searchBarcode,} from '../../redux/actions/products';

const Scan = () => {
    const barcodeData = useEventListener();
    const navigation = useNavigation();
    const dispatch = useDispatch();
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
        if (!query) {
            onEmptyQuery();
            return;
        }
        const actionCallback = (data: any) => {
            if (data?.error) {
                onError(data, query)
            } else {
                if (data.length == 0) {
                    onEmptyData(query)
                } else {
                    if (data && Object.keys(data).length !== 0) {
                        onSuccess(data, query)
                    }
                }
            }
        };
        const onError = (data: any, query: any) => {
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
                        dispatch(searchBarcode(query, actionCallback));
                    },
                },
                negativeButtonText: 'Cancel',
            });
        }
        dispatch(searchBarcode(query, actionCallback));

    };

    const onEmptyQuery = () => {
        showPopup({
            message: 'Search query is empty',
            positiveButton: {text: 'Ok'},
        });
    }
    const onEmptyData = (query: any) => {
        setState({
            ...state,
            searchProductCode: {
                query: query,
                results: null,
            },
            error: `No search results found for barcode "${query}"`,
        });
    }
    const onSuccess = (data: any, query: any) => {
        setState({
            ...state,
            searchProductCode: {
                query: query,
                results: data,
            },
            error: null,
        });
        if ( data.type === 'Product') {
            navigateToProduct(data)
        } else if (data.type === 'Location') {
            navigateToLocationDetails(query)
        } else if ( data.type === 'Container') {
            navigateToLPNDetails(data.id, data?.shipment?.shipmentNumber ?? "")
        }
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
    const navigateToLPNDetails = (id: string | undefined, stockMovement: any) => {
        if (id) { // @ts-ignore
            navigation.navigate('LpnDetail', {
                id: id,
                shipmentNumber: stockMovement,
            });
            console.log("Container")
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
