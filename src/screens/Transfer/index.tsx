import React, {useState} from 'react';
import { useDispatch, useSelector} from 'react-redux';
import styles from './styles';;
import { View,ScrollView } from 'react-native';
import InputBox from '../../components/InputBox';
import Button from "../../components/Button";
import {RootState} from "../../redux/reducers";
import {useNavigation, useRoute} from "@react-navigation/native";


const Transfer = () => {
    const route = useRoute();
    const navigation = useNavigation()
    const {item}: any = route.params

    const navigateToTransfer = () => {
    }
    const dispatch = useDispatch();
    const location = useSelector((state: RootState) => state.mainReducer.currentLocation)
    const [state, setState] = useState<any>({
        productCode: "",
        lotNumber:"",
        LotNumber:"",
        From:"",
        ExpirationDate:"",
        binFromLocation:"",
        binToLocation: "",
        quantity: "0",
        quantityToTransfer:"",
        error: null,
        searchProductCode: null,
    })

    const onChangeBin = (text: string) => {
        setState({...state, binToLocation: text})
    }
    const onChangeQuantity = (text: string) => {
        setState({...state, quantity: text})
    }


    const onTransfer = () =>{
        // dispatch(showScreenLoading("Update Transfer"))
        const request :any = {
            "status": "COMPLETED",
            "stockTransferNumber": "",
            "description": "Test stock transfer from bin with quantity =",
            "origin.id": location.id,
            "destination.id": location.id,
            "stockTransferItems": [
                {
                    "product.id":item?.product.productCode,
                    "inventoryItem.id": "",
                    "Expiration Date": item?.inventoryItem.expirationDate?? "Never",
                    "Lot Number": item?.inventoryItem.lotNumber ?? "Default",
                    "Quantity Available to Transfer": item?.quantityAvailableToPromise.toString(),
                   "quantity": state.quantity,
             }]
        }
       //dispatch(updateStockTransfer(request));
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
                    // onChange={onChangeProduct}
                    label={'Lot Number'}/>
                <InputBox
                    value={item?.inventoryItem.expirationDate?? "Never" }
                    disabled={true}
                    editable={false}
                    label={'Expiration Date'}/>
                <InputBox
                    value={item?.inventoryItem.binLocation??"Never"}
                    label={'From'}
                    disabled={true}
                    editable={false} />
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
                    value={state.quantity}
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