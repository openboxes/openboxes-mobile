import React, {useEffect, useState} from 'react';
import {DispatchProps} from './types';
import styles from './styles';
import {
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    ListRenderItemInfo,
    View,
} from 'react-native';
import {pickListVMMapper} from './PickListVMMapper';
import {showScreenLoading, hideScreenLoading} from '../../redux/actions/main';
import {connect, useDispatch} from 'react-redux';
import showPopup from '../../components/Popup';
import {
    getPickListItemAction,
    submitPickListItem,
} from '../../redux/actions/orders';
import {
    searchProductByCodeAction,
    searchProductGloballyAction,
} from '../../redux/actions/products';
import {searchLocationByLocationNumber} from '../../redux/actions/locations';
import {useNavigation, useRoute} from '@react-navigation/native';
import Button from '../../components/Button';
import useEventListener from '../../hooks/useEventListener';
import InputBox from '../../components/InputBox';
import Carousel from 'react-native-snap-carousel';
import {device} from '../../constants';
import {PicklistItem} from "../../data/picklist/PicklistItem";

const PickOrderItem = () => {
    const route = useRoute();
    const dispatch = useDispatch();
    const navigation = useNavigation()
    const barcodeData = useEventListener();
    const [state, setState] = useState<any>({
        error: '',
        pickListItem: null,
        order: null,
        productSearchQuery: '',
        binLocationSearchQuery: '',
        quantityPicked: '0',
        product: null,
        productCode: '',
        binLocation: null,
        lotNumber: "",
        binLocationName: '',
    });
    const vm = pickListVMMapper(route.params);
    console.log('VM', vm);
    useEffect(() => {
        getPickListItem();
    }, []);
    useEffect(() => {
        if (barcodeData && Object.keys(barcodeData).length !== 0) {
            onBarCodeScanned(barcodeData.data);
        }
    }, [barcodeData]);

    const showErrorPopup = (
        data: any,
        query: any,
        actionCallback: any,
        searchBarcode: any,
    ) => {
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
    };
    const onBarCodeScanned = (query: string) => {
        // handleBarcodeScan(barcodeNo);
        if (!query) {
            showPopup({
                message: 'Search query is empty',
                positiveButton: {text: 'Ok'},
            });
            return;
        }
        if (query.includes('LOG-XXX')) {
            const actionCallback = (data: any) => {
                if (data?.error) {
                    showErrorPopup(
                        data,
                        query,
                        actionCallback,
                        searchProductGloballyAction,
                    );
                } else {
                    console.log(data);
                    if (data.length == 0) {
                        showPopup({
                            message: `No search results found for product name "${query}"`,
                            positiveButton: {text: 'Ok'},
                        });
                    } else {
                        if (data && Object.keys(data).length !== 0) {
                            if (
                                state.pickListItem?.productCode !== data.data[0].productCode
                            ) {
                                showPopup({
                                    message: `You have scanned a wrong product barcode "${query}"`,
                                    positiveButton: {text: 'Ok'},
                                });
                            } else {
                                state.quantityPicked = (
                                    parseInt(state.quantityPicked, 10) + 1
                                ).toString();
                                state.product = data.data[0];
                                state.productCode = data.data[0].productCode;
                            }
                            setState({...state});
                        }
                    }
                    dispatch(hideScreenLoading());
                }
            };
            dispatch(searchProductGloballyAction(query, actionCallback));
        } else {
            const actionBinLocationCallback = (data: any) => {
                if (data?.error) {
                    showErrorPopup(
                        data,
                        query,
                        actionBinLocationCallback,
                        searchLocationByLocationNumber,
                    );
                } else {
                    if (data.length == 0) {
                        showPopup({
                            message: `No search results found for Location name "${query}"`,
                            positiveButton: {text: 'Ok'},
                        });
                    } else {
                        console.log(data);
                        if (data && Object.keys(data).length !== 0) {
                            if (state.binLocation === '' || state.binLocation === data.name) {
                                state.binLocation = data;
                                state.binLocationSearchQuery = '';
                            }
                            setState({...state});
                        } else {
                            showPopup({
                                message: `You have scanned a wrong bin location barcode "${query}"`,
                                positiveButton: {text: 'Ok'},
                            });
                        }
                    }
                    dispatch(hideScreenLoading());
                }
            };
            dispatch(
                searchLocationByLocationNumber(query, actionBinLocationCallback),
            );
        }
    };

    const getPickListItem = async () => {
        try {
            // showProgressBar("Fetching PickList Item")
            const {pickListItem}: any = route.params;
            const actionCallback = (data: any) => {
                const currentState = {...state}
                currentState.productCode = data?.productCode;
                currentState.binLocationName = data?.['binLocation.name'] ?? 'Default';
                currentState.lotNumber = data?.lotNumber ?? 'Default';
                currentState.pickListItem = data;
                console.log(currentState)
                setState(currentState);
            };
            console.debug('pickListItem?.id::');
            console.debug(pickListItem?.id);
            dispatch(getPickListItemAction(pickListItem?.id, actionCallback));
        } catch (e) {
            console.log('pickListItem?.id::', e.message);

        }
    };

    const formSubmit = () => {
        try {
            let errorTitle = '';
            let errorMessage = '';
            /*if (state.product == null) {
                    errorTitle = 'Product Code!';
                    errorMessage = 'Please scan Product Code.';
                  } else */
            if (state.quantityPicked == null || state.quantityPicked == '') {
                errorTitle = 'Quantity Pick!';
                errorMessage = 'Please pick some quantity.';
            } else if (vm.picklistItems.quantityPicked === state.quantityPicked) {
                errorTitle = 'Quantity Pick!';
                errorMessage = 'Quantity picked is not valid';
            }
            if (errorTitle != '') {
                showPopup({
                    title: errorTitle,
                    message: errorMessage,
                    // positiveButtonText: "Retry",
                    negativeButtonText: 'Cancel',
                });
                return Promise.resolve(null);
            }
            const requestBody = {
                'product.id': state.pickListItem.product?.id,
                productCode: state.pickListItem.product.productCode,
                'inventoryItem.id': state.pickListItem.inventoryItem.id,
                'binLocation.id': state.pickListItem.binLocation
                    ? state.pickListItem.binLocation?.id
                    : "",
                'binLocation.locationNumber': state.pickListItem.binLocation
                    ? state.pickListItem.binLocation?.locationNumber
                    : state.binLocationSearchQuery,
                quantityPicked: state.quantityPicked,
                'picker.id': "",
                datePicked: "",
                reasonCode: "",
                comment: "",
                forceUpdate: false,
            };
            const actionCallback = (data: any) => {
                console.debug('data after submit');
                console.debug(data);
                if (data?.error) {
                    showPopup({
                        title: data.error.message
                            ? `Failed to load results`
                            : null,
                        message:
                            data.error.message ??
                            `Failed to load results`,
                        negativeButtonText: 'Cancel',
                    });
                } else {
                    const {order, pickListItem}: any = route.params;
                    // @ts-ignore
                    navigation.navigate('OrderDetails', {
                        order,
                        pickList: pickListItem
                    })
                }
            };
            dispatch(submitPickListItem(
                state.pickListItem?.id as string,
                requestBody,
                actionCallback,
            ));
        } catch (e) {
            const title = e.message ? 'Failed submit item' : null;
            const message = e.message ?? 'Failed submit item';
            showPopup({
                title: title,
                message: message,
                // positiveButtonText: "Retry",
                negativeButtonText: 'Cancel',
            });
            return Promise.resolve(null);
        } finally {
        }
    };

    const productSearchQueryChange = (query: string) => {
        setState({
            ...state,
            productSearchQuery: query,
        });
        onProductBarCodeSearchQuerySubmitted();
    };

    const onProductBarCodeSearchQuerySubmitted = () => {
        if (!state.productCode) {
            showPopup({
                message: 'Search query is empty',
                positiveButton: {
                    text: 'Ok',
                },
            });
            return;
        }

        const actionCallback = (data: any) => {
            console.debug('product searched completed');
            console.debug(data.data.length);
            if (!data || data.data.length == 0) {
                showPopup({
                    message: 'Product not found with ProductCode:' + state.productCode,
                    positiveButton: {
                        text: 'Ok',
                    },
                });
                setState({
                    ...state,
                    productCode: '',
                    productSearchQuery: '',
                });
                return;
            } else if (data.data.length == 1) {
                console.debug('data.length');
                console.debug(data.length);
                setState({
                    ...state,
                    product: data.data[0],
                    quantityPicked: (parseInt(state.quantityPicked, 10) + 1).toString(),
                    productSearchQuery: '',
                });
            }
        };
        dispatch(searchProductByCodeAction(state.productCode, actionCallback));
    };

    const onBinLocationBarCodeSearchQuerySubmitted = () => {
        if (!state.binLocationName) {
            showPopup({
                message: 'Search query is empty',
                positiveButton: {
                    text: 'Ok',
                },
            });
            return;
        }

        const actionCallback = (location: any) => {
            if (!location || location.error) {
                showPopup({
                    message:
                        'Bin Location not found with LocationNumber:' +
                        state.binLocationName,
                    positiveButton: {
                        text: 'Ok',
                    },
                });
                setState({
                    ...state,
                    binLocationName: '',
                    binLocationSearchQuery: '',
                });
                return;
            } else if (location) {
                setState({
                    ...state,
                    binLocation: location,
                    binLocationSearchQuery: '',
                });
            }
        };
        dispatch(
            searchLocationByLocationNumber(state.binLocationName, actionCallback),
        );
    };

    const binLocationSearchQueryChange = (query: string) => {
        setState({
            ...state,
            binLocationSearchQuery: query,
        });
        onBinLocationBarCodeSearchQuerySubmitted();
    };

    const quantityPickedChange = (query: string) => {
        setState({
            ...state,
            quantityPicked: query,
        });
    };

    const onChangeProduct = (text: string) => {
        state.productCode = text;
        setState({...state});
    };

    const onChangeBin = (text: string) => {
        state.binLocationName = text;
        setState({...state});
    };
    console.log('finall value', state)
    return (
        <View style={styles.screenContainer}>
           <View style={styles.swiperView}>
                <Carousel
                    key={3}
                    dimensions={{width: device.windowWidth}}
                    sliderWidth={device.windowWidth}
                    sliderHeight={device.windowHeight}
                    itemWidth={device.windowWidth - 70}
                    data={vm?.order?.picklist?.picklistItems}
                    firstItem={vm.selectedPinkItemIndex ? vm.selectedPinkItemIndex : 0 }
                    scrollEnabled={true}
                    renderItem={({item, index}: ListRenderItemInfo<PicklistItem>) => {
                        return (
                            <View key={index}>
                                <ScrollView style={styles.inputContainer}>
                                    <View style={styles.listItemContainer}>
                                        <View style={styles.row}>
                                            <View style={styles.col50}>
                                                <Text style={styles.label}>Product Code</Text>
                                                <Text style={styles.value}>
                                                    {item?.productCode}
                                                </Text>
                                            </View>
                                            <View style={styles.col50}>
                                                <Text style={styles.label}>Product Name</Text>
                                                <Text style={styles.value}>
                                                    {item?.['product.name']}
                                                </Text>
                                            </View>
                                        </View>

                                        <View style={styles.row}>
                                            <View style={styles.col50}>
                                                <Text style={styles.label}>Picked</Text>
                                                <Text style={styles.value}>
                                                    {item?.quantityPicked} / {item?.quantityRequested}
                                                </Text>
                                            </View>
                                            <View style={styles.col50}>
                                                <Text style={styles.label}>Remaining</Text>
                                                <Text style={styles.value}>
                                                    {item?.quantityRemaining}
                                                </Text>
                                            </View>
                                        </View>
                                    </View>
                                    <View style={styles.from}>
                                        <InputBox
                                            value={state.productCode}
                                            disabled={true}
                                            editable={false}
                                            onEndEdit={productSearchQueryChange}
                                            onChange={onChangeProduct}
                                            label={'Product Code'}
                                        />
                                        <InputBox
                                            value={state.lotNumber}
                                            label={'Lot Number'}
                                            disabled={true}
                                            onEndEdit={binLocationSearchQueryChange}
                                            onChange={onChangeBin}
                                            editable={false}
                                        />
                                        <InputBox
                                            value={state.binLocationName}
                                            label={'Bin Location'}
                                            disabled={true}
                                            onEndEdit={binLocationSearchQueryChange}
                                            onChange={onChangeBin}
                                            editable={false}
                                        />
                                        <InputBox
                                            label={'Quantity to Pick'}
                                            value={state.quantityPicked}
                                            onChange={quantityPickedChange}
                                            disabled={false}
                                            editable={false}
                                            onEndEdit={quantityPickedChange}
                                            keyboard={'number-pad'}
                                            showSelect={false}
                                        />
                                        <Button title="Pick Item" onPress={formSubmit}/>
                                    </View>
                                </ScrollView>
                                <View style={styles.bottom}>

                            </View>
                        </View>
                        );
                    }}
                />
            </View>
        </View>
    );
};

const mapDispatchToProps: DispatchProps = {
    showScreenLoading,
    hideScreenLoading,
    getPickListItemAction,
    submitPickListItem,
    searchProductByCodeAction,
    searchLocationByLocationNumber,
};
export default connect(null, mapDispatchToProps)(PickOrderItem);
