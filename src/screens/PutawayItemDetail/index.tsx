import {DispatchProps, Props, State} from "./types";
import React, {useEffect, useState} from "react";
import {TouchableOpacity, View, Text, TextInput} from "react-native";
import styles from './styles';
import showPopup from "../../components/Popup";
import {searchLocationByLocationNumber} from "../../redux/actions/locations";
import {hideScreenLoading, showScreenLoading} from "../../redux/actions/main";
import {connect, useDispatch, useSelector} from "react-redux";
import {submitPutawayItem} from "../../redux/actions/putaways";
import {useRoute, useNavigation} from "@react-navigation/native";
import Button from "../../components/Button";
import useEventListener from "../../hooks/useEventListener";
import {searchProductGloballyAction} from "../../redux/actions/products";
import InputBox from "../../components/InputBox";
import {RootState} from "../../redux/reducers";
import showPopup from '../../components/Popup';
import {searchLocationByLocationNumber} from '../../redux/actions/locations';
import {hideScreenLoading} from '../../redux/actions/main';
import {useDispatch, useSelector} from 'react-redux';
import {submitPutawayItem} from '../../redux/actions/putaways';
import {useRoute} from '@react-navigation/native';
import Button from '../../components/Button';
import useEventListener from '../../hooks/useEventListener';
import {searchProductGloballyAction} from '../../redux/actions/products';
import InputBox from '../../components/InputBox';
import {RootState} from '../../redux/reducers';

const PutawayItemDetail = () => {
    const route = useRoute();
    const barcodeData = useEventListener();
    const dispatch = useDispatch();
    const navigation = useNavigation()
    const location = useSelector((state: RootState) => state.mainReducer.currentLocation)
    const [state, setState] = useState<any>({
        error: null,
        putAway: null,
        putAwayItem: null,
        orderId: null,
        binLocationSearchQuery: "",
        quantityPicked: "0",
        productCode: "",
        binFromLocation: "",
        binToLocation: "",
        binToData:"",
        quantity: "0",
    })
    const {putAway, putAwayItem}: any = route.params;


    useEffect(() => {
        setState({
            ...state,
            putAway: putAway,
            putAwayItem: putAwayItem,
            productCode: putAwayItem?.["product.productCode"],
            quantity: putAwayItem?.["quantity"].toString(),
            binFromLocation: putAwayItem?.["currentLocation.name"],
            binToLocation: putAwayItem?.["putawayLocation.name"]
        })
    }, [])
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
                            if (state.putAwayItem?.["product.productCode"] !== data.data[0].productCode) {
                                showPopup({
                                    message: `You have scanned a wrong product barcode "${query}"`,
                                    positiveButton: {text: 'Ok'},
                                });
                            }
                            setState({...state})
                        }
                    }
                    dispatch(hideScreenLoading());
                    ;
                }
            };
            dispatch(searchProductGloballyAction(query, actionCallback));
        } else {
            const actionBinLocationCallback = (data: any) => {
                if (data?.error) {
                    showErrorPopup(data, query, actionBinLocationCallback, searchLocationByLocationNumber)
                } else {
                    if (data.length == 0) {
                        showPopup({
                            message: `No search results found for Location name "${query}"`,
                            positiveButton: {text: 'Ok'},
                        });
                    } else {
                        console.log(data)
                        if (data && Object.keys(data).length !== 0) {
                            if (state.binToLocation === "" || state.putAwayItem?.["putawayLocation.name"] ===  data.name) {
                                state.binToLocation = data.name;
                                state.binToData =data;
                            }
                            setState({...state})
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
            dispatch(searchLocationByLocationNumber(query, actionBinLocationCallback));
        }
    };

  const onBinLocationBarCodeSearchQuerySubmitted = () => {
    if (!state.binLocationSearchQuery) {
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
            state.binLocationSearchQuery,
          positiveButton: {
            text: 'Ok',
          },
        });
        return;
      } else if (location) {
        setState({
          ...state,
          binToLocation: location,
          binLocationSearchQuery: '',
        });
      }
    };
    dispatch(
      searchLocationByLocationNumber(
        state.binLocationSearchQuery,
        actionCallback,
      ),
    );
  };

    const quantityPickedChange = (query: string) => {
        setState({
            ...state,
            quantityPicked: query
        })
    }
    const binLocationSearchQueryChange = (query: string) => {
        setState({
            ...state,
            binLocationSearchQuery: query
        })
    }

    const formSubmit = () => {
        let errorTitle = ""
        let errorMessage = ""
        if (state.binToLocation == null) {
            errorTitle = "Bin Location!"
            errorMessage = "Please scan Bin Location."
        }
        if (errorTitle != "") {
            showPopup({
                title: errorTitle,
                message: errorMessage,
                // positiveButtonText: "Retry",
                negativeButtonText: "Cancel"
            })
            return Promise.resolve(null)
        }

        const requestBody = {
            "id": state.putAway?.id,
            "putawayNumber": state.putAway?.putawayNumber,
            "putawayStatus": "COMPLETED",
            "putawayDate": state.putAway?.putawayDate??"",
            "putawayAssignee": "",
            "origin.id": state.putAway?.["origin.id"],
            "destination.id": state.putAway?.["destination.id"],
            "putawayItems": [
                {
                    "id": state.putAwayItem?.id,
                    "putawayStatus": "COMPLETED",
                    "currentFacility.id": state.putAwayItem?.["currentFacility.id"],
                    "currentLocation.id": state.putAwayItem?.["currentLocation.id"],
                    "product.id": state.putAwayItem?.["product.id"],
                    "inventoryItem.id": state.putAwayItem?.["inventoryItem.id"],
                    "putawayFacility.id": state.putAwayItem?.["putawayFacility.id"],
                    "putawayLocation.id":state.putAwayItem?.["putawayLocation.id"],
                    "quantity": state.putAwayItem?.quantity
                }
            ],
            "orderedBy.id": "",
            "sortBy": ""
        }
        const actionCallback = (data: any) => {
            console.debug("data after submit")
            console.debug(data)
            if (data?.error) {
                showPopup({
                    title: data.error.message ? 'Failed to submit' : null,
                    message: data.error.message ?? 'Failed to submit',
                    positiveButton: {
                        text: 'Retry',
                        callback:()=>{
                            dispatch(submitPutawayItem(state.putAwayItem?.id as string, requestBody, actionCallback));
                        }
                    },
                    negativeButtonText: 'Cancel',
                });
            } else {
                showPopup({
                    title: ' submit' ,
                    message:'successfully submit',
                    positiveButton: {
                        text: 'ok',
                        callback: () => {
                            navigation.navigate('PutawayList');
                        }
                    },
                });
            }
        }
        dispatch(submitPutawayItem(state.putAwayItem?.id as string, requestBody, actionCallback));

    }

  const onChangeProduct = (text: string) => {
    setState({...state, productCode: text});
  };

    const onChangeFrom = (text: string) => {
        setState({...state, binFromLocation: text})
    }
    const onChangeBin = (text: string) => {
        setState({...state, binToLocation: text})
    }
    const onChangeQuantity = (text: string) => {
        setState({...state, quantity: text})
    }
    return (
        <View style={styles.contentContainer}>
            <View style={styles.rowItem}>
                <View style={styles.columnItem}>
                    <Text style={styles.label}>{'Status'}</Text>
                    <Text style={styles.value}>{state.putAway?.putawayStatus}</Text>
                </View>
                <View style={styles.columnItem}>
                    <Text style={styles.label}>{'Putaway Number'}</Text>
                    <Text style={styles.value}>{state.putAway?.putawayNumber}</Text>
                </View>
            </View>
            <View style={styles.rowItem}>
                <View style={styles.columnItem}>
                    <Text style={styles.label}>{'Product Code'}</Text>
                    <Text style={styles.value}>{state.putAwayItem?.["product.productCode"]}</Text>
                </View>
                <View style={styles.columnItem}>
                    <Text style={styles.label}>{'Product Name'}</Text>
                    <Text style={styles.value}>{state.putAwayItem?.["product.name"]}</Text>
                </View>
            </View>
            <View style={styles.rowItem}>
                <View style={styles.columnItem}>
                    <Text style={styles.label}>{'Current Location'}</Text>
                    <Text style={styles.value}>{state.putAway?.putawayStatus}</Text>
                </View>
                <View style={styles.columnItem}>
                    <Text style={styles.label}>{'Putaway Location'}</Text>
                    <Text style={styles.value}>{state.putAwayItem?.["putawayLocation.name"]}</Text>
                </View>
            </View>
            <View style={styles.rowItem}>
                <View style={styles.columnItem}>
                    <Text style={styles.label}>Preferred Location</Text>
                    <Text style={styles.value}>{state.putAwayItem?.["preferredBin.name"]??'None'}</Text>
                </View>
                <View style={styles.columnItem}>
                    <Text style={styles.label}>Quantity</Text>
                    <Text style={styles.value}>{state.putAwayItem?.["quantity"]}</Text>
                </View>
            </View>
            <View style={styles.from}>
                <InputBox
                    value={state.productCode}
                    disabled={true}
                    editable={false}
                    onChange={onChangeProduct}
                    label={'Product Code'}/>
                <InputBox
                    value={state.binFromLocation}
                    label={'Current Location'}
                    disabled={true}
                    onChange={onChangeFrom}
                    editable={false}
                />
                <InputBox
                    value={state.binToLocation}
                    disabled={true}
                    editable={false}
                    onChange={onChangeBin}
                    label={'Putaway Location'}/>
                <InputBox
                    label={'Quantity to transfer'}
                    value={state.quantity}
                    editable={false}
                    onChange={onChangeQuantity}
                    disabled={true}
                    keyboard={"number-pad"}
                    />
            </View>
            <View>
                <Button
                    title="Putaway"
                    style={{
                        marginTop: 8,
                    }}
                    onPress={formSubmit}
                />
            </View>

        </View>

    )

}

export default PutawayItemDetail;
