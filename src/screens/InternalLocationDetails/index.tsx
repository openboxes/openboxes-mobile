import React, {useEffect, useState} from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import styles from './styles';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigation, useRoute} from "@react-navigation/native";
import useEventListener from "../../hooks/useEventListener";
import {Order} from "../../data/order/Order";
import Product from "../../data/product/Product";
import showPopup from "../../components/Popup";
import {
    searchProductGloballyAction,
} from '../../redux/actions/products';
import {hideScreenLoading} from '../../redux/actions/main';
import {getInternalLocationDetails} from "../../redux/actions/locations";
import {Card} from "react-native-paper";
import {RootState} from "../../redux/reducers";

const InternalLocationDetails = () => {
    const barcodeData = useEventListener();
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const route = useRoute();
    const location = useSelector((state: RootState) => state.mainReducer.currentLocation)
    const [state, setState] = useState<any>({
        error: null,
        searchProductCode: null,
        locationData:null,
    });


    useEffect(() => {
        const {id}:any = route.params
        onInternalLocation(id)
    }, [])

    const onInternalLocation = (id: string) => {
        // handleBarcodeScan(barcodeNo);
        if (!id) {
            showPopup({
                message: 'Search id is empty',
                positiveButton: {text: 'Ok'},
            });
            return;
        }
        const actionLocationCallback = (data: any) => {
            if (data?.error) {
                showPopup({
                    title: data.error.message
                        ? `Failed to load search results with value = "${id}"`
                        : null,
                    message:
                        data.error.message ??
                        `Failed to load search results with value = "${id}"`,
                    positiveButton: {
                        text: 'Retry',
                        callback: () => {
                            dispatch(getInternalLocationDetails(id,location.id, actionLocationCallback));
                        },
                    },
                    negativeButtonText: 'Cancel',
                });
            } else {
                if (data.length == 0) {
                    showPopup({
                        message: `No search results found for Location name "${id}"`,
                        positiveButton: {text: 'Ok'},
                    });
                } else {
                    console.log(data)
                    if (data && Object.keys(data).length !== 0) {
                        state.locationData = data.data;
                        setState({...state})
                    }
                }
                dispatch(hideScreenLoading());
            }
        };
        dispatch(getInternalLocationDetails(id,location.id, actionLocationCallback));
    };

    const RenderItem = ({title, subTitle}: any) => {
        return (
            <View style={styles.columnItem}>
                <Text style={styles.label}>{title}</Text>
                <Text style={styles.value}>{subTitle}</Text>
            </View>)
    }
    const navigateToDetails = (item: any) => {
        navigation.navigate("AdjustStock",{item});
    }


   const renderListItem = (item: any, index: any) =>  (
        <TouchableOpacity
            key={index}
            onPress={() => navigateToDetails(item)}
            style={styles.itemView}>
            <Card>
                <Card.Content>
                    <View style={styles.rowItem}>
                        <RenderItem title={"Bin Location"} subTitle={item?.binLocation?.name ?? "Default"}/>
                        <RenderItem title={"Quantity OnHand"} subTitle={item.quantityOnHand ?? 0}/>
                    </View>
                    <View style={styles.rowItem}>
                        <RenderItem title={"Lot Number"} subTitle={item?.inventoryItem?.lotNumber ?? "Default"}/>
                        <RenderItem title={"Quantity Available"} subTitle={item.quantityAvailable ?? 0}/>
                    </View>
                </Card.Content>
            </Card>
        </TouchableOpacity>
    )
    return (
        <View style={styles.screenContainer}>
           {state.locationData &&
            <View>
                <View style={styles.rowItem}>
                    <RenderItem title={'Bin Location Number'} subTitle={state.locationData?.locationNumber ?? ''}/>
                    <RenderItem title={'Bin Location Name'} subTitle={state.locationData?.name ?? ''}/>
                </View>
                <View style={styles.rowItem}>
                    <RenderItem title={'Location Type'} subTitle={state.locationData?.locationType.name ?? ''}/>
                    <RenderItem title={'Facility Number'}
                                subTitle={state.locationData?.parentLocation.locationNumber ?? ''}/>
                </View>
                <View style={styles.rowItem}>
                    <RenderItem title={'Facility Name'} subTitle={state.locationData?.parentLocation?.name ?? ''}/>
                    <RenderItem title={'Zone Name'} subTitle={state.locationData?.zoneName ?? ''}/>
                </View>
                <View style={styles.rowItem}>
                    <RenderItem title={'Number of items'} subTitle={state.locationData?.availableItems?.length ?? ''}/>
                </View>
                <Text style={styles.boxHeading}>Available Items</Text>
                {state.locationData?.availableItems?.map((item:any, index:any) => {
                        return renderListItem(item, index)
                    }
                )}
            </View>}
        </View>);

}


export default InternalLocationDetails;
