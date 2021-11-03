import React, {ReactElement, useState} from "react";
import showPopup from "../../components/Popup";
import {getStockMovements} from "../../redux/actions/orders";
import {saveAndUpdateLpn} from "../../redux/actions/lpn";
import {DispatchProps, Props} from "./Types";
import {connect} from "react-redux";
import {Image, View} from "react-native";
import {Order} from "../../data/order/Order";
import styles from "./styles";
import InputBox from "../../components/InputBox";
import Button from "../../components/Button";
import SelectDropdown from "react-native-select-dropdown";
import {getShipmentPacking, getShipmentOrigin} from "../../redux/actions/packing";
import {RootState} from "../../redux/reducers";
import Location from "../../data/location/Location";


export interface State {
    stockMovements: Order[] | null
    open: false,
    stockMovement: Order | null,
    name: string | null
    containerNumber: string | null
    stockMovementList: string[] | []
    stockMovementId: string | any
}

class CreateLpn extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            stockMovements: null,
            stockMovementList: [],
            open: false,
            stockMovement: null,
            name: null,
            containerNumber: null,
            stockMovementId: null,

        }
    }

    componentDidMount() {
        console.debug("Did mount with stockmovement")
        this.getShipmentOrigin()
    }

    fetchContainerList = () => {

        const actionCallback = (data: any) => {
            if (data?.error) {
                showPopup({
                    title: data.error.message ? 'Container' : null,
                    message: data.error.message ?? 'Failed to fetch Container List',
                    positiveButton: {
                        text: 'Ok'
                    }
                });
            } else {
                console.debug(">>>>>>>>>>>>>>>>")
                // console.debug(data)

                let stockMovementList: string[] = [];
                console.log(data)
                // data.map((item: any) => {
                //     stockMovementList.push(item.name)
                // })
                // this.setState({
                //     stockMovementList: stockMovementList,
                //     stockMovements: data
                // })
            }
        }
        console.debug("Calling getShipmentPacking")
        this.props.getShipmentPacking("OUTBOUND", actionCallback);
    }

    getShipmentOrigin = () => {
        const {currentLocation} = this.props
        const actionCallback = (data: any) => {
            if (data?.error) {
                showPopup({
                    title: data.error.message ? 'StockMovements' : null,
                    message: data.error.message ?? 'Failed to fetch StockMovements',
                    positiveButton: {
                        text: 'Ok'
                    }
                });
            } else {
                console.debug(">>>>>>>>>>>>>>>>")
                // console.debug(data)

                let stockMovementList: string[] = [];
                console.log(data)
                data.map((item: any) => {
                    stockMovementList.push(item.name)
                })
                this.setState({
                    stockMovementList: stockMovementList,
                    stockMovements: data
                })
            }
        }
        console.debug("Calling getShipmentOrigin",currentLocation?.id, currentLocation)
        this.props.getShipmentOrigin(currentLocation?.id ?? "1", actionCallback);
    }

    saveLpn = () => {
        const requestBody = {
            "name": this.state.name,
            "containerNumber": this.state.containerNumber,
            "containerType.id": "2",
            "shipment.id": this.state.stockMovementId
        }

        const actionCallback = (data: any) => {
            console.debug("data after submit")
            console.debug(data)

        }
        console.debug("Save LPN", requestBody)
        this.props.saveAndUpdateLpn(requestBody, actionCallback);
    }

    onChangeName = (text: string) => {
        this.setState({
            name: text
        })
    }

    onChangeContainerNumber = (text: string) => {
        this.setState({
            containerNumber: text
        })
    }

    renderIcon = () => {
        return (
            <Image style={styles.arrowDownIcon} source={require('../../assets/images/arrow-down.png')}/>
        )
    }

    render() {
        // const {open, value, stockMovements} = this.state;
        // const [selectedLanguage, setSelectedLanguage] = this.state;
        console.debug("{item.item.name}:");
        return (
            <View style={styles.container}>
                <View style={styles.from}>
                    <InputBox
                        value={this.state.name}
                        onChange={this.onChangeName}
                        disabled={true}
                        label={'Name'}/>
                    <SelectDropdown
                        data={this.state.stockMovementList}
                        onSelect={(selectedItem, index) => {
                            console.log(selectedItem, index)
                            const stockMovement = this.state.stockMovements?.find(i => i.name === selectedItem);
                            this.setState({stockMovement: selectedItem, stockMovementId: stockMovement?.id})
                        }}
                        defaultValueByIndex={0}
                        renderDropdownIcon={this.renderIcon}
                        buttonStyle={styles.select}
                        buttonTextAfterSelection={(selectedItem, index) => selectedItem}
                        rowTextForSelection={(item, index) => item}
                    />
                    <InputBox
                        value={this.state.containerNumber}
                        disabled={true}
                        onChange={this.onChangeContainerNumber}
                        label={'Container Number'}/>
                </View>
                <View style={styles.bottom}>
                    <Button
                        title="Submit"
                        onPress={this.saveLpn}
                        style={{
                            marginTop: 8,
                        }}
                    />
                </View>

            </View>
        )
    }


}

const mapStateToProps = (state: RootState) => ({
    currentLocation: state.mainReducer.currentLocation,
});
const mapDispatchToProps: DispatchProps = {
    getShipmentPacking,
    getShipmentOrigin,
    saveAndUpdateLpn
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateLpn);
