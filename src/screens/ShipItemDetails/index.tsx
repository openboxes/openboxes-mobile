import React, {useEffect, useState} from 'react';
import {Text, View, Image} from 'react-native';
import styles from './styles';
import Button from '../../components/Button';

import SelectDropdown from 'react-native-select-dropdown';
import InputBox from '../../components/InputBox';
import {useRoute} from '@react-navigation/native';
import {useDispatch} from 'react-redux';
import useEventListener from '../../hooks/useEventListener';
import showPopup from '../../components/Popup';
import {
    getContainerDetails, getShipmentOrigin,
    getShipmentPacking,
    submitShipmentDetails,
} from '../../redux/actions/packing';

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
    const {item}: any = route.params
    const [state, setState] = useState<any>({
        error: '',
        quantityPicked: '0',
        product: null,
        productCode: '',
        shipmentDetails: null,
        containerId: '',
        containerList: ""
    });

    useEffect(() => {
        console.log(" Shipment Details", route.params)
        getShipmentDetails(item.shipment.shipmentNumber)
        getContainerDetail()
    }, [])
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
                            dispatch(getShipmentOrigin(id, callback));
                        },
                    },
                    negativeButtonText: 'Cancel',
                });
            } else {
                console.log('getShipmentDetails', data);
                if (data && Object.keys(data).length !== 0) {
                    console.log(data.shipmentNumber);
                    state.shipmentDetails = data;
                }
                setState({...state});
            }
        };
        dispatch(getShipmentOrigin(id, callback));
    };

    const submitShipmentDetail = (id: string) => {
        const request = {
            'container.id': state.containerId,
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
            }
        };
        dispatch(submitShipmentDetails(id, request,callback));
    };

    const getContainerDetail = (id: string = '') => {
        const callback = (data: any) => {
            if (data?.error) {
                showPopup({
                    title: data.error.message ? 'Container details' : null,
                    message:
                        data.error.message ??
                        `Failed to load Container details value ${id}`,
                    positiveButton: {
                        text: 'Retry',
                        callback: () => {
                            dispatch(getContainerDetails(id, callback));
                        },
                    },
                    negativeButtonText: 'Cancel',
                });
            } else {
                if (data && Object.keys(data).length !== 0) {
                    let containerList: any = []
                    data.map((dataItem: any) => {
                        containerList.push(dataItem.id)
                    })
                    state.containerList = containerList;
                    setState({...state})
                    console.log('getContainerDetail', data);

                }
            }
        };
        dispatch(getContainerDetails(id, callback));
    };
    const quantityPickedChange = (query: string) => {
        setState({
            ...state,
            quantityPicked: query,
        });
    };

    return (
        <View style={styles.contentContainer}>
            <View style={styles.rowItem}>
                <View style={styles.columnItem}>
                    <Text style={styles.label}>{'Shipment Number'}</Text>
                    <Text style={styles.value}>{item.shipment.shipmentNumber}</Text>
                </View>
                <View style={styles.columnItem}>
                    <Text style={styles.label}>{'Container'}</Text>
                    <Text style={styles.value}>{item.container ?? "Default"}</Text>
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
            <View>
                <Text>{'Container'}</Text>
                <SelectDropdown
                    data={state.containerList}
                    onSelect={(selectedItem, index) => {
                        state.containerId = selectedItem
                        setState({...state})
                        console.log(selectedItem, index);
                    }}
                    defaultValueByIndex={0}
                    renderDropdownIcon={renderIcon}
                    buttonStyle={styles.select}
                    buttonTextAfterSelection={(selectedItem, index) => selectedItem}
                    rowTextForSelection={(item, index) => item}
                />
            </View>
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
                        submitShipmentDetail(item.shipment.id)
                    }}
                />
            </View>
        </View>
    );
};
export default ShipItemDetails;
