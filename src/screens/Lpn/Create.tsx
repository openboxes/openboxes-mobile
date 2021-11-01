import React, {ReactElement, useState} from "react";
import showPopup from "../../components/Popup";
import {getStockMovements} from "../../redux/actions/orders";
import {saveAndUpdateLpn} from "../../redux/actions/lpn";
import {DispatchProps, Props} from "./Types";
import {connect} from "react-redux";
import {FlatList, ListRenderItemInfo, Text, TouchableOpacity, View} from "react-native";
import Theme from "../../utils/Theme";
import {Order} from "../../data/order/Order";
import {Picker} from '@react-native-picker/picker';
import styles from "./styles";
import InputBox from "../../components/InputBox";
import {TextInput} from "react-native-paper";
import Button from "../../components/Button";


export interface State {
    stockMovements: Order[] | null
    open: false,
    stockMovement: Order | null,
    name: string | null
    containerNumber: string | null
}

class CreateLpn extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            stockMovements: null,
            open: false,
            stockMovement: null,
            name: null,
            containerNumber: null
        }
    }

    componentDidMount() {
        console.debug("Did mount with stockmovement")
        this.fetchStockMovement()
    }

    fetchStockMovement = () => {
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
                this.setState({
                    stockMovements: data
                })
            }
        }
        console.debug("Calling stockmovements")
        this.props.getStockMovements("OUTBOUND", "PICKED", actionCallback);
    }

    saveLpn = () => {
        const requestBody = {
            "name": this.state.name,
            "containerNumber": this.state.containerNumber,
            "containerType.id": null,
            "shipment.id": this.state.stockMovement?.id
        }

        const actionCallback = (data: any) => {
            console.debug("data after submit")
            console.debug(data)

        }
        console.debug("Save LPN")
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
                    <Picker
                        selectedValue={this.state.stockMovement}
                        onValueChange={(itemValue, itemIndex) => this.setState({stockMovement: itemValue})}
                    >
                        {this.state.stockMovements?.map(st => (
                            <Picker.Item label={st.name} value={st.id}/>
                        ))}
                        {/*<Picker.Item label="Java" value="java" />*/}
                        {/*<Picker.Item label="JavaScript" value="js" />*/}
                    </Picker>
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

const mapDispatchToProps: DispatchProps = {
    getStockMovements,
    saveAndUpdateLpn
}

export default connect(null, mapDispatchToProps)(CreateLpn);
