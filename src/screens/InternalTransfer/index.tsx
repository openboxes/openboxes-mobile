import React, {useEffect, useState} from 'react';
import {connect, useDispatch} from 'react-redux';
import styles from './styles';
import Location from '../../data/location/Location';
import _, {Dictionary} from 'lodash';
import {ScrollView, View, TouchableOpacity, Text, TextInput, Image} from 'react-native';
import Header from '../../components/Header';
import {List} from 'react-native-paper';
import {Props, State, DispatchProps} from './types'
import showPopup from '../../components/Popup';
import InputBox from '../../components/InputBox';
import {showScreenLoading, hideScreenLoading} from '../../redux/actions/main';
import useEventListener from "../../hooks/useEventListener";
import {searchProductGloballyAction} from "../../redux/actions/products";
import {searchLocationByLocationNumber} from "../../redux/actions/locations"
import Button from "../../components/Button";
import {updateStockTransfer} from "../../redux/actions/transfers";


const InternalTransfer = () => {
    const barcodeData = useEventListener();
    const dispatch = useDispatch();
    const [state, setState] = useState<any>({
        productCode: "",
        product:"",
        fromData:"",
        toData:"",
        binFromLocation:"",
        binToLocation: "",
        quantity: "0",
        error: null,
        searchProductCode: null,
    })


    useEffect(() => {
        if (barcodeData && Object.keys(barcodeData).length !== 0) {
            onBarCodeScanned(barcodeData.data)
        }
    }, [barcodeData])

    const showErrorPopup = (data: any, query: any, actionCallback: any, searchBarcode: any) => {
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
                    dispatch(searchBarcode(query, actionCallback));
                },
            },
            negativeButtonText: 'Cancel',
        });
    }
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
                    showErrorPopup(data, query, actionCallback, searchProductGloballyAction)
                } else {
                    console.log(data)
                    if (data.length == 0) {
                        showPopup({
                            message: `No search results found for product name "${query}"`,
                            positiveButton: {text: 'Ok'},
                        });
                    } else {
                        if (data && Object.keys(data).length !== 0) {
                            if (state.productCode === "" || state.productCode === data.data[0].productCode) {
                                state.product = data.data[0];
                                state.productCode = data.data[0].productCode;
                                state.quantity = (parseInt(state.quantity,10) +1).toString();
                            } else {
                                showPopup({
                                    message: `You have scanned a wrong product barcode "${query}"`,
                                    positiveButton: {text: 'Ok'},
                                });
                            }
                            setState({...state})
                        }
                    }
                    dispatch(hideScreenLoading());;
                }
            };
            dispatch(searchProductGloballyAction(query, actionCallback));
        } else {
            const actionLocationCallback = (data: any) => {
                if (data?.error) {
                    showErrorPopup(data, query, actionLocationCallback, searchLocationByLocationNumber)
                } else {
                    if (data.length == 0) {
                        showPopup({
                            message: `No search results found for Location name "${query}"`,
                            positiveButton: {text: 'Ok'},
                        });
                    } else {
                        console.log(data)
                        if (data && Object.keys(data).length !== 0) {
                            if (state.binFromLocation === "") {
                                state.fromData = data;
                                state.binFromLocation = data.name;
                            }else if(state.binToLocation === "") {
                                state.toData = data;
                                state.binToLocation = data.name;
                            }
                            setState({...state})
                        }
                    }
                    dispatch(hideScreenLoading());
                }
            };
            dispatch(searchLocationByLocationNumber(query, actionLocationCallback));
        }
    };

    const onChangeProduct = (text: string) => {
        setState({...state, productCode: text})
    }

    const onChangeFrom = (text: string) => {
        setState({...state, binFromLocation: text})
    }
    const onChangeBin = (text: string) => {
        setState({...state, binToLocation: text})
    }
    const onChangeQuantity = (text: string) => {
        setState({...state, quantity: text})
    }


    const onTransfer = () =>{
        // dispatch(showScreenLoading("Update Transfer"))
        const request :any = {
            "status": "PENDING",
            "stockTransferNumber": "",
            "description": "Test stock transfer from bin with quantity =",
            "origin.id": "1",
            "destination.id": "1",
            "stockTransferItems": [
                {
                    "product.id":state.product.id,
                    "inventoryItem.id": "",
                    "location.id": "1",
                    "originBinLocation.id": state.fromData.id,
                    "destinationBinLocation.id": state.toData.id,
                    "quantity": state.quantity

                }]
        }
        // const actionCallback = (data: any) => {
        //     if (data?.error) {
        //         showPopup({
        //             title: data.error.message
        //                 ? `Failed to update`
        //                 : null,
        //             message:
        //                 data.error.message ??
        //                 `Failed to update`,
        //             positiveButton: {
        //                 text: 'Retry',
        //                 callback: () => {
        //                     dispatch(updateStockTransfer(request));
        //                 },
        //             },
        //             negativeButtonText: 'Cancel',
        //         });
        //     } else {
        //         if (data.length == 0) {
        //             showPopup({
        //                 message: `No search results`,
        //                 positiveButton: {text: 'Ok'},
        //             });
        //         }
        //         dispatch(hideScreenLoading());;
        //     }
        // };
        dispatch(updateStockTransfer(request));
    }


    return (
        <View style={styles.container}>
            <View style={styles.from}>
                <InputBox
                    value={state.productCode}
                    disabled={true}
                    onChange={onChangeProduct}
                    label={'Product Code'}/>
                <InputBox
                    value={state.binFromLocation}
                    label={'From'}
                    disabled={true}
                    onChange={onChangeFrom}
                />
                <InputBox
                    value={state.binToLocation}
                    disabled={true}
                    onChange={onChangeBin}
                    label={'To'}/>
                <InputBox
                    label={'Quantity to transfer'}
                    value={state.quantity}
                    onChange={onChangeQuantity}
                    disabled={true}
                    keyboard={"number-pad"}
                    showSelect={true}/>
            </View>
            <View style={styles.bottom}>
                <Button
                    title="TRANSFER"
                    onPress={onTransfer}
                    style={{
                        marginTop: 8,
                    }}
                />
            </View>
        </View>
    );
}


export default InternalTransfer;
