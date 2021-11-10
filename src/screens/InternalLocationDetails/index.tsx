import React, {useEffect, useState} from 'react';
import {Text, View} from 'react-native';
import styles from './styles';
import {useDispatch} from 'react-redux';
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

const InternalLocationDetails = () => {
    const barcodeData = useEventListener();
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const route = useRoute();
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
                            dispatch(getInternalLocationDetails(id, actionLocationCallback));
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
        dispatch(getInternalLocationDetails(id, actionLocationCallback));
    };

    const RenderItem = ({title, subTitle}: any) => {
        return (
            <View style={styles.columnItem}>
                <Text style={styles.label}>{title}</Text>
                <Text style={styles.value}>{subTitle}</Text>
            </View>)
    }

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
            </View>}
        </View>);

}


export default InternalLocationDetails;
