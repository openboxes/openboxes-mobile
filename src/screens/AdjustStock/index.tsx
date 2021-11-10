import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import styles from './styles';
import {Image, ScrollView, Text, View} from 'react-native';
import InputBox from '../../components/InputBox';
import Button from "../../components/Button";
import showPopup from "../../components/Popup";
import {useNavigation, useRoute} from "@react-navigation/native";
import SelectDropdown from "react-native-select-dropdown";
import RenderData from "../../components/RenderData";
import {RootState} from "../../redux/reducers";
import {stockAdjustments} from "../../redux/actions/products";

const reasonCodes = [
    {
        "id": "CONSUMED",
        "name": "Consumed",
        "sortOrder": 24
    },
    {
        "id": "CORRECTION",
        "name": "Correction",
        "sortOrder": 30
    },
    {
        "id": "DAMAGED",
        "name": "Damaged product",
        "sortOrder": 4
    },
    {
        "id": "DATA_ENTRY_ERROR",
        "name": "Data entry error",
        "sortOrder": 16
    },
    {
        "id": "EXPIRED",
        "name": "Expired product",
        "sortOrder": 3
    },
    {
        "id": "FOUND",
        "name": "Found",
        "sortOrder": 26
    },
    {
        "id": "MISSING",
        "name": "Missing",
        "sortOrder": 27
    },
    {
        "id": "RECOUNTED",
        "name": "Recounted",
        "sortOrder": 29
    },
    {
        "id": "REJECTED",
        "name": "Rejected",
        "sortOrder": 32
    },
    {
        "id": "RETURNED",
        "name": "Returned",
        "sortOrder": 25
    },
    {
        "id": "SCRAPPED",
        "name": "Scrapped",
        "sortOrder": 31
    },
    {
        "id": "STOLEN",
        "name": "Stolen",
        "sortOrder": 28
    },
    {
        "id": "OTHER",
        "name": "Other",
        "sortOrder": 100
    }
];

const AdjustStock = () => {
    const dispatch = useDispatch();
    const route = useRoute();
    const {item}: any = route.params
    const navigation = useNavigation();
    const location = useSelector((state: RootState) => state.mainReducer.currentLocation)
    console.log(JSON.stringify(item))
    const [state, setState] = useState<any>({
        comments: "",
        quantityAdjusted: "",
        reasonCode: "",
        reasonCodeList: [],
        error: null,
    })
    useEffect(() => {
        let reasonList: any = []
        reasonCodes.map((item) => {
            reasonList.push(item.name)
        })
        state.reasonCodeList = reasonList;
        setState({...state})
    }, [])

    const onSave = () => {
        let errorTitle = ""
        let errorMessage = ""
        if (state.quantityAdjusted == null || state.quantityAdjusted == "") {
            errorTitle = "Quantity!"
            errorMessage = "Please fill the Quantity to Adjusted"
        }
        if (errorTitle != "") {
            showPopup({
                title: errorTitle,
                message: errorMessage,
                negativeButtonText: "Cancel"
            })
            return Promise.resolve(null)
        }

        const request ={
            "location.id": location.id,
            "product.id": item.product.id,
            "inventoryItem.id": item?.inventoryItem?.id ?? "",
            "binLocation.id": item?.binLocation?.id ?? "",
            "quantityAvailable":item.quantityAvailableToPromise,
            "reasonCode": state?.reasonCode?.id ?? "CORRECTION",
            "quantityAdjusted":state.quantityAdjusted,
            "comments":state.comments
        }
        submitStockAdjustments(request)
    }

    const onChangeComment = (text: string) => {
        setState({...state, comments: text})
    }

    const onChangeQuantity = (text: string) => {
        setState({...state, quantityAdjusted: text})
    }
    const submitStockAdjustments = (requestBody: any) => {
        const callback = (data: any) => {
            if (data?.error) {
                showPopup({
                    title: data.error.message
                        ? `stock Adjustments`
                        : null,
                    message:
                        data.error.message ??
                        `Failed to update`,
                    positiveButton: {
                        text: 'Retry',
                        callback: () => {
                            dispatch(stockAdjustments( requestBody, callback));
                        },
                    },
                    negativeButtonText: 'Cancel',
                });
            } else {
                if (data && Object.keys(data).length !== 0) {

                }
            }
        }
        dispatch(stockAdjustments( requestBody, callback));

    }

    const RenderItem = (): JSX.Element => {
        return (<View
            style={styles.itemView}>
            <View style={styles.rowItem}>
                <RenderData title={"Product Name"} subText={item?.product.name}/>
                <RenderData title={"Product Code"} subText={item.product.productCode}/>
            </View>
            <View style={styles.rowItem}>
                <RenderData title={"Lot Number"} subText={item.inventoryItem.lotNumber ?? "Default"}/>
                <RenderData title={"Bin Location"} subText={item.binLocation ?? "Default"}/>
            </View>
            <View style={styles.rowItem}>
                <RenderData title={"Expiration Date"} subText={item.inventoryItem.expirationDate ?? "Never"}/>
                <RenderData title={"Quantity Available"} subText={item.quantityAvailableToPromise}/>
            </View>
        </View>);
    }
    const renderIcon = () => {
        return (
            <Image style={styles.arrowDownIcon} source={require('../../assets/images/arrow-down.png')}/>
        )
    }

    return (
        <ScrollView style={styles.container}>
            <RenderItem/>
            <View style={styles.from}>
                <Text style={styles.value}>{"Reason Code"}</Text>
                <SelectDropdown
                    data={state.reasonCodeList}
                    onSelect={(selectedItem, index) => {
                        console.log(selectedItem, index)
                        state.reasonCode = selectedItem;
                        setState({...state})
                    }}
                    defaultValueByIndex={0}
                    renderDropdownIcon={renderIcon}
                    buttonStyle={styles.select}
                    buttonTextAfterSelection={(selectedItem, index) => selectedItem}
                    rowTextForSelection={(item, index) => item}
                />
                <InputBox
                    label={'Quantity Adjusted'}
                    value={state.quantityAdjusted}
                    onChange={onChangeQuantity}
                    disabled={true}
                    keyboard={"number-pad"}/>
                <InputBox
                    value={state.comments}
                    onChange={onChangeComment}
                    disabled={true}
                    editable={true}
                    label={'Comments'}/>
            </View>
            <View style={styles.bottom}>
                <Button
                    title="Adjust Stock"
                    onPress={onSave}
                />
            </View>
        </ScrollView>
    );
}


export default AdjustStock;
