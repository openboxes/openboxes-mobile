import React from 'react';
import showPopup from '../../components/Popup';
import {saveAndUpdateLpn} from '../../redux/actions/lpn';
import {DispatchProps, Props} from './Types';
import {connect} from 'react-redux';
import {Image, Text, View} from 'react-native';
import {Order} from '../../data/order/Order';
import styles from './styles';
import InputBox from '../../components/InputBox';
import Button from '../../components/Button';
import {getShipmentOrigin, getShipmentPacking,} from '../../redux/actions/packing';
import {RootState} from '../../redux/reducers';
import AutoInputInternalLocation from '../../components/AutoInputInternalLocation';

export interface State {
    stockMovements: Order[] | null;
    open: false;
    stockMovement: Order | null;
    name: string | null;
    containerNumber: string | null;
    stockMovementList: string[] | [];
    stockMovementId: string | any;
}

class CreateLpn extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        const {id, shipmentDetail} = this.props.route.params;this.state = {
            stockMovements: shipmentDetail?.shipmentNumber || null,
      stockMovement: shipmentDetail?.shipmentNumber ||null,
            stockMovementList: [],
            open: false,

            name: null,
            containerNumber: null,
            stockMovementId: id ||null,
        };
    }

    componentDidMount() {

        this.getShipmentOrigin();
    }

    fetchContainerList = () => {
        const actionCallback = (data: any) => {
            if (data?.error) {
                showPopup({
                    title: data.errorMessage ? 'Container' : "Error",
                    message: data.errorMessage ?? 'Failed to fetch Container List',
                    positiveButton: {
                        text: 'Ok',
                    },
                });
            } else {
                let stockMovementList: string[] = [];
                // data.map((item: any) => {
                //     stockMovementList.push(item.name)
                // })
                // this.setState({
                //     stockMovementList: stockMovementList,
                //     stockMovements: data
                // })
            }
        };
        this.props.getShipmentPacking('OUTBOUND', actionCallback);
    };

    getShipmentOrigin = () => {
        const {currentLocation} = this.props;
        const actionCallback = (data: any) => {
            if (data?.error) {
                showPopup({
                    title: data.errorMessage ? 'StockMovements' : "Error",
                    message: data.errorMessage ?? 'Failed to fetch StockMovements',
                    positiveButton: {
                        text: 'Ok',
                    },
                });
            } else {
                let stockMovementList: string[] = [];
                data.map((item: any) => {
                    stockMovementList.push(item.shipmentNumber);
                });
                this.setState({
                    stockMovementList: stockMovementList,
                    stockMovements: data,
                });
            }
        };
        this.props.getShipmentOrigin(currentLocation?.id ?? '', actionCallback);
    };

    saveLpn = () => {
        const requestBody = {
            name: this.state.name,
            containerNumber: this.state.containerNumber,
            'containerType.id': '2',
            'shipment.id': this.state.stockMovementId,
        };
        const actionCallback = (data: any) => {
            if (data?.error) {
                showPopup({
                    title: data.errorMessage ? `Failed to Save` : null,
                    message: data.errorMessage ?? `Failed to Save`,
                    positiveButton: {
                        text: 'Retry',
                        callback: () => {
                            this.props.saveAndUpdateLpn(requestBody, actionCallback);
                        },
                    },
                    negativeButtonText: 'Cancel',
                });
            } else {
                // if (data.length == 0) {
                //     showPopup({
                //         message: `No search results`,
                //         positiveButton: {text: 'Ok'},
                //     });
                // } else
                if (data && Object.keys(data).length !== 0) {
                    this.props.navigation.navigate('LpnDetail', {
                        id: data.id,
                        shipmentNumber: this.state.stockMovement,
                    });
                }
            }
        };
        console.debug('Save LPN', requestBody);
        this.props.saveAndUpdateLpn(requestBody, actionCallback);
    };

    onChangeName = (text: string) => {
        this.setState({
            name: text,
        });
    };

    onChangeContainerNumber = (text: string) => {
        this.setState({
            containerNumber: text,
        });
    };

    renderIcon = () => {
        return (
            <Image
                style={styles.arrowDownIcon}
                source={require('../../assets/images/arrow-down.png')}
            />
        );
    };

    render() {

        console.debug('{item.item.name}:');
        return (
            <View style={styles.container}>
                <View style={styles.from}>
                    <Text style={styles.label}>Shipment Number</Text>
                    <AutoInputInternalLocation
                        label="AutoInputInternalLocation"
                        data={this.state.stockMovementList}
                        selectedData={(selectedItem: any, index: number) => {
                            const stockMovement = this.state.stockMovements?.find(
                                i => i.shipmentNumber === selectedItem,
                            );
                            this.setState({
                                stockMovement: selectedItem,
                                stockMovementId: stockMovement?.id,
                            });
                        }}initValue={this.state.stockMovements}
                    />
                    <InputBox
                        value={this.state.name}
                        onChange={this.onChangeName}
                        editable={false}
                        label={'Name'}
                    />
                    <InputBox
                        value={this.state.containerNumber}
                        onChange={this.onChangeContainerNumber}
                        editable={false}
                        label={'Container Number'}
                    />
                </View>
                <View style={styles.bottom}>
                    <Button
                        title="Submit"
                        onPress={this.saveLpn}
                        // eslint-disable-next-line react-native/no-inline-styles
                        style={{
                            marginTop: 8,
                        }}
                    />
                </View>
            </View>
        );
    }
}

const mapStateToProps = (state: RootState) => ({
    currentLocation: state.mainReducer.currentLocation,
});
const mapDispatchToProps: DispatchProps = {
    getShipmentPacking,
    getShipmentOrigin,
    saveAndUpdateLpn,
};

export default connect(mapStateToProps, mapDispatchToProps)(CreateLpn);
