import React, {useEffect, useState} from 'react';
import {Text, View, Image} from 'react-native';
import styles from './styles';
import Button from '../../components/Button';

import SelectDropdown from 'react-native-select-dropdown';
import InputBox from '../../components/InputBox';
import {useNavigation, useRoute} from '@react-navigation/native';
import {useDispatch} from 'react-redux';
import showPopup from '../../components/Popup';
import {
    getShipmentPacking,
    submitShipmentDetails,
} from '../../redux/actions/packing';
import AutoInputInternalLocation from '../../components/AutoInputInternalLocation';
import Index from '../LpnDetail/Index';

const renderIcon = () => {
    return (
        <Image
            style={styles.arrowDownIcon}
            source={require('../../assets/images/arrow-down.png')}
        />
    );
};

const ShipItemDetails = () => {
    const route = useRoute();
    const dispatch = useDispatch();
    const navigation = useNavigation()
    const {item}: any = route.params
    const [state, setState] = useState<any>({
        error: '',
        quantityPicked: '0',
        product: null,
        productCode: '',
        shipmentDetails: null,
        container:null,
        containerId: '',
        containerList: ""
    });
    const [ selectedContainerItem, setSelectedContainerItem ] = useState<number>(0);

    useEffect(() => {
        console.log(" Shipment Details", route.params)
        getShipmentDetails(item.shipment.shipmentNumber)
    }, [])
    console.log('state', state);
    const getShipmentDetails = (id: string) => {
        const callback = (data: any) => {
            if (data?.error) {
                showPopup({
                    title: data.error.message ? 'Shipment details' : null,
                    message:
                        data.error.message ?? `Failed to load Shipment details value ${id}`,
                    positiveButton: {
                        text: 'Retry',
                        callback: () => {
                            dispatch(getShipmentPacking(id, callback));
                        },
                    },
                    negativeButtonText: 'Cancel',
                });
            } else {
                console.log('getShipmentDetails', data);
                if (data && Object.keys(data).length !== 0) {
                    state.shipmentDetails = data;
                    let containerList: any = []
                    data.availableContainers.map((dataItem: any) => {
                        containerList.push(dataItem.name)
                    })
                    state.containerList = containerList;
                    setState({...state})
                    console.log('getContainerDetail', data);
                }
                setState({...state});
            }
        };
        dispatch(getShipmentPacking(id, callback));
    };

    const submitShipmentDetail = (id: string) => {
        const request = {
            'container.id': state.container.id,
            "quantityToPack": state.quantityPicked
        };
        const callback = (data: any) => {
            if (data?.error) {
                showPopup({
                    title: data.error.message ? 'Shipment details' : null,
                    message: data.error.message ?? 'Failed to submit shipment details',
                    positiveButton: {
                        text: 'Retry',
                        callback: () => {
                            dispatch(submitShipmentDetails(id, request,callback));
                        },
                    },
                    negativeButtonText: 'Cancel',
                });
            } else {
                if (data && Object.keys(data).length !== 0) {
                    console.log(data);
                }
                setState({...state});
                navigation.navigate('OutboundStockDetails', {shipmentId: item.shipment.id})
            }
        };
        dispatch(submitShipmentDetails(id, request,callback));
    };

    const quantityPickedChange = (query: string) => {
        setState({
            ...state,
            quantityPicked: query,
        });
    };
    console.log('selectedContainerItem', selectedContainerItem);
    return (
        <View style={styles.contentContainer}>
            <View style={styles.rowItem}>
                <View style={styles.columnItem}>
                    <Text style={styles.label}>{'Shipment Number'}</Text>
                    <Text style={styles.value}>{item.shipment.shipmentNumber}</Text>
                </View>
                <View style={styles.columnItem}>
                    <Text style={styles.label}>{'Container'}</Text>
                    <Text style={styles.value}>{item.container.name ?? "Default"}</Text>
                </View>
            </View>
            <View style={styles.rowItem}>
                <View style={styles.columnItem}>
                    <Text style={styles.label}>{'Product Code'}</Text>
                    <Text style={styles.value}>{item.inventoryItem.product.productCode}</Text>
                </View>
                <View style={styles.columnItem}>
                    <Text style={styles.label}>{'Product Name'}</Text>
                    <Text style={styles.value}>{item.inventoryItem.product.name}</Text>
                </View>
            </View>
            <View style={styles.rowItem}>
                <View style={styles.columnItem}>
                    <Text style={styles.label}>{'LOT Number'}</Text>
                    <Text style={styles.value}>{item.inventoryItem.lotNumber ?? "Default"}</Text>
                </View>
                <View style={styles.columnItem}>
                    <Text style={styles.label}>{'Expiration Date'}</Text>
                    <Text style={styles.value}>{item.inventoryItem.expirationDate ?? "No Expiry"}</Text>
                </View>
            </View>
            <View style={styles.rowItem}>
                <View style={styles.columnItem}>
                    <Text style={styles.label}>{'Quantity'}</Text>
                    <Text style={styles.value}>{item.quantityRemaining}</Text>
                </View>
            </View>
            <Text>{'Container'}</Text>
            <AutoInputInternalLocation
                label="AutoInputInternalContainer"
                data={state.containerList ? state.containerList : [] }
                getMoreData={(d: any) => console.log('get More data api call', d)}
                selectedData={(selectedItem: any, index: number) => {
                    console.log('index....', index)
                    setSelectedContainerItem(index);
                    state.containerId = selectedItem;
                    const container = state.shipmentDetails.availableContainers[index];
                    console.log('container',  container);
                    setState({
                        ...state,
                        containerId : selectedItem,
                        container:container,
                        selectedContainerItem: index
                    })
                }}
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
            <View style={styles.bottom}>
                <Button
                    title="PACK ITEM"
                    onPress={() => {
                        submitShipmentDetail(item.id)
                    }}
                />
            </View>
        </View>
    );
};
export default ShipItemDetails;
