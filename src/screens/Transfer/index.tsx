import React, {useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import styles from './styles';
import {ScrollView, View} from 'react-native';
import InputBox from '../../components/InputBox';
import Button from "../../components/Button";
import {RootState} from "../../redux/reducers";
import {useRoute} from "@react-navigation/native";
import {updateStockTransfer} from "../../redux/actions/transfers";
import showPopup from "../../components/Popup";
import {searchLocationByLocationNumber} from "../../redux/actions/locations";


const Transfer = () => {
    const route = useRoute();
    const {item}: any = route.params
    const dispatch = useDispatch();
    const location = useSelector((rootState: RootState) => rootState.mainReducer.currentLocation)
    const [state, setState] = useState<any>({
        binToLocation: "",
        binToLocationData: "",
        quantity: "0",
    })
    const binLocationSearchQueryChange = (query: string) => {
        setState({
            ...state,
            binLocationSearchQuery: query,
        });
        onBinLocationBarCodeSearchQuerySubmitted();
    };

    const onBinLocationBarCodeSearchQuerySubmitted = () => {
        if (!state.binToLocation) {
            showPopup({
                message: 'Search query is empty',
                positiveButton: {
                    text: 'Ok',
                },
            });
            return;
        }

        const actionCallback = (locationData: any) => {
            if (!locationData || locationData.error) {
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
                    binToLocation: '',
                    binLocationSearchQuery: '',
                });
            } else if (locationData) {
                setState({
                    ...state,
                    binToLocationData: locationData,
                    binLocationSearchQuery: '',
                });
            }
        };
        dispatch(
            searchLocationByLocationNumber(state.binToLocation, actionCallback),
        );
    };
    const onChangeBin = (text: string) => {
        setState({...state, binToLocation: text})
    }
    const onChangeQuantity = (text: string) => {
        setState({...state, quantity: text})
    }


    const onTransfer = () => {
        const request: any = {
            "status": "COMPLETED",
            "stockTransferNumber": "",
            "description": "",
            "origin.id": location.id,
            "destination.id": location.id,
            "stockTransferItems": [{
                "product.id": item.inventoryItem.product.id,
                "inventoryItem.id": item.inventoryItem.id,
                "location.id": location.id,
                "originBinLocation.id": item?.binLocation.id ?? "Never",
                "destinationBinLocation.id": state.binToLocationData.id,
                "quantity": state.quantity
            }
            ]
        }
        const actionCallback = (data: any) => {
            if (data?.error) {
                showPopup({
                    title:  data.errorMessage ? 'Submit' : "Error",
                    message: 'Failed to submit',
                    positiveButton: {
                        text: 'Retry',
                        callback: () => {
                            dispatch(updateStockTransfer(request, actionCallback));
                        }
                    },
                    negativeButtonText: 'Cancel',
                });
            } else {
                showPopup({
                    title: 'Submit',
                    message: 'Successfully submit',
                    positiveButton: {
                        text: 'ok',
                    },
                });
            }
        }
        dispatch(updateStockTransfer(request, actionCallback));
    }

    return (
        <ScrollView>
            <View style={styles.container}>
                <View style={styles.from}>
                    <InputBox
                        value={item?.product.productCode}
                        disabled={true}
                        editable={false}
                        label={'Product Code'}/>
                    <InputBox
                        value={item?.inventoryItem.lotNumber ?? "Default"}
                        disabled={true}
                        editable={false}
                        label={'Lot Number'}/>
                    <InputBox
                        value={item?.inventoryItem.expirationDate ?? "Never"}
                        disabled={true}
                        editable={false}
                        label={'Expiration Date'}/>
                    <InputBox
                        value={item?.binLocation.name ?? "Never"}
                        label={'From'}
                        disabled={true}
                        editable={false}/>
                    <InputBox
                        label={'Quantity Available to Transfer'}
                        value={item?.quantityAvailableToPromise.toString()}
                        disabled={true}
                        editable={false}
                    />
                    <InputBox
                        label={'Quantity to transfer'}
                        value={state.quantity}
                        onChange={onChangeQuantity}
                        disabled={false}
                        editable={false}
                        keyboard={"number-pad"}
                    />
                    <InputBox
                        label={'Bin Location'}
                        value={state.binToLocation}
                        onEndEdit={binLocationSearchQueryChange}
                        onChange={onChangeBin}
                        disabled={false}
                        editable={false}
                        keyboard={"default"}
                    />
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
        </ScrollView>
    );
}

export default Transfer;
