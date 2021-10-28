import React, {useEffect, useState} from 'react';
import {useDispatch} from 'react-redux';
import styles from './styles';
import {View} from 'react-native';
import InputBox from '../../components/InputBox';
import Button from "../../components/Button";
import showPopup from "../../components/Popup";
import {getStockMovements} from "../../redux/actions/transfers";
import {toString} from "lodash";


const InboundOrderDetails = () => {
    const dispatch = useDispatch();
    const [state, setState] = useState<any>({
        stockDetails: {},
        lineItems: {},
        productCode: "",
        stockMovementNumber: "",
        lotNumber: "",
        expDate: "",
        receiveLocation: "",
        quantityRemaining: "0",
        quantityToReceive: "0",
        error: null,
    })
    useEffect(() => {
        getStocksDetails("ff8081817c80c6a2017c81fd1792000f")
    }, [])

    const getStocksDetails = (id: string) => {
        if (!id) {
            showPopup({
                message: 'Product id is empty',
                positiveButton: {text: 'Ok'},
            });
            return;
        }

        const actionCallback = (data: any) => {
            if (data?.error) {
                showPopup({
                    title: data.error.message
                        ? `Failed to load stock details with value = "${id}"`
                        : null,
                    message:
                        data.error.message ??
                        `Failed to load stock details with value = "${id}"`,
                    positiveButton: {
                        text: 'Retry',
                        callback: () => {
                            dispatch(getStockMovements(id, actionCallback));
                        },
                    },
                    negativeButtonText: 'Cancel',
                });
            } else {
                if (data && Object.keys(data).length !== 0) {
                    state.stockDetails = data
                    state.lineItems = data.lineItems[0]
                    state.productCode = data.lineItems[0].productCode
                    state.stockMovementNumber = ""
                    state.lotNumber = data.lineItems[0].inventoryItem?.lotNumber
                    state.expDate = data.lineItems[0].inventoryItem?.expirationDate
                    state.receiveLocation = data.destination.name
                    state.quantityRemaining = (data.lineItems[0].quantityRequired).toString()
                    state.quantityToReceive = (data.lineItems[0].quantityRequired).toString()
                    setState({...state})
                }
            }
        };
        dispatch(getStockMovements(id, actionCallback));
    }
    const onReceive = () => {
        let errorTitle = ""
        let errorMessage = ""
        if (state.quantityToReceive == null || state.quantityToReceive == "") {
            errorTitle = "Quantity!"
            errorMessage = "Please fill the Quantity to Receive"
        } else if (parseInt(state.quantityToReceive, 10) > parseInt(state.quantityRemaining, 10)) {
            errorTitle = "Quantity!"
            errorMessage = "Quantity to Receive is greater than quantity remaining"
        }
        if (errorTitle != "") {
            showPopup({
                title: errorTitle,
                message: errorMessage,
                negativeButtonText: "Cancel"
            })
            return Promise.resolve(null)
        }
    }


    return (
        <View style={styles.container}>
            <View style={styles.from}>
                <InputBox
                    value={state.stockMovementNumber}
                    label={'Stock Movement number'}
                    disabled={true}
                    editable={false}
                />
                <InputBox
                    value={state.productCode}
                    disabled={true}
                    editable={false}
                    label={'Product Code'}/>
                <InputBox
                    value={state.lotNumber}
                    disabled={true}
                    editable={false}
                    label={'Lot Number'}/>
                <InputBox
                    label={'Expiry Date'}
                    value={state.expDate}
                    disabled={true}
                    editable={false}
                    keyboard={"number-pad"}/>
                <InputBox
                    label={'Receiving Location'}
                    value={state.receiveLocation}
                    disabled={true}
                    editable={false}
                    keyboard={"number-pad"}/>
                <InputBox
                    label={'Quantity Remaining'}
                    value={state.quantityRemaining}
                    disabled={true}
                    editable={false}
                    keyboard={"number-pad"}/>
                <InputBox
                    label={'Quantity to receive'}
                    value={state.quantityToReceive}
                    disabled={true}
                    keyboard={"number-pad"}/>
            </View>
            <View style={styles.bottom}>
                <Button
                    title="Receive"
                    onPress={onReceive}
                />
            </View>
        </View>
    );
}


export default InboundOrderDetails;
