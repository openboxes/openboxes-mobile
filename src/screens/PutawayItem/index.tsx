import React, {Component} from 'react';
import {Props, State} from './types'
import {TextInput, View, Text, Image, Button, Alert} from "react-native";
import SelectDropdown from 'react-native-select-dropdown'
import {RootState} from "../../redux/reducers";
import {DispatchProps} from "./types";
import styles from './styles'
import {hideScreenLoading, showScreenLoading} from "../../redux/actions/main";
import {connect} from "react-redux";
import {getBinLocationsAction} from "../../redux/actions/locations";
import {createPutawayOderAction} from "../../redux/actions/putaways";
import AutoInputInternalLocation from '../../components/AutoInputInternalLocation';

const arrowDown = require('../../assets/images/arrow-down.png')


class PutawayItem extends Component <Props, State> {

    constructor(props: Props) {
        super(props);

        this.state = {
            selectedLocation: null,
            quantity: '1'
        }
    }

    componentWillMount() {
        this.props.getBinLocationsAction()
    }

    create = () => {
        const {SelectedLocation, createPutawayOderAction} = this.props
        const {item} = this.props.route.params
        const {currentLocation} = this.props
        const data = {
            "putawayNumber": "",
            "putawayStatus": "PENDING",
            "putawayDate": "",
            "putawayAssignee": "",
            "origin.id": SelectedLocation.id,
            // "origin.name": "Main Warehouse",
            "destination.id":  SelectedLocation.id,
            // "destination.name": "Main Warehouse",
            "putawayItems": [
                {
                    "putawayStatus": "PENDING",
                    "product.id": item["product.id"],
                    "inventoryItem.id": item["inventoryItem.id"],
                    "putawayFacility.id": SelectedLocation.id,
                    "currentLocation.id": item["currentLocation.id"],
                    "putawayLocation.id": this.state.selectedLocation.id,
                    "quantity": this.state.quantity
                }
            ],
            "orderedBy.id": "",
            "sortBy": null
        }

        createPutawayOderAction(data, ()=>{
            Alert.alert("Order created successfully");
        })
    }

    render() {
        const {item} = this.props.route.params
        const {locations} = this.props
        const {quantity} = this.state
        return (
            <View style={styles.container}>
                <View style={{flex: 1}}>
                    <View style={styles.row}>
                        <Text>Product Code</Text>
                        <TextInput value={item['product.productCode']}/>
                    </View>
                    <View style={styles.row}>
                        <Text>Product Name</Text>
                        <TextInput value={item['product.name']}/>
                    </View>
                    <View style={styles.row}>
                        <Text>Lot Number</Text>
                        <TextInput value={item['inventoryItem.lotNumber']}/>
                    </View>
                    <AutoInputInternalLocation
                        label="AutoInputInternalContainer"
                        data={locations}
                        getMoreData={(d: any) => console.log('get More data api call', d)} // for calling api for more results
                        selectedData={(selectedLocation: any) => {
                            console.log('selectedLocation', selectedLocation);
                            this.setState({selectedLocation})
                        }}
                    />
                    <View style={styles.row}>
                        <Text>Quantity</Text>
                        <View style={styles.quantityBox}>
                            <TextInput
                                style={styles.quantityInput}
                                keyboardType='number-pad'
                                value={quantity}
                                onChangeText={(quantity) => {
                                    this.setState({quantity})
                                }}
                            />
                            <Text style={styles.quantityText}>{`/ ${item.quantity}`}</Text>
                        </View>

                    </View>
                </View>
                <Button
                    style={{padding: 20}}
                    title={'Create Putaway'}
                    onPress={this.create}
                />
            </View>
        )
    }
}


const mapStateToProps = (state: RootState) => ({
    locations: state.locationsReducer.locations,
    currentLocation: state.mainReducer.currentLocation,
    SelectedLocation: state.locationsReducer.SelectedLocation,
});

const mapDispatchToProps: DispatchProps = {
    getBinLocationsAction,
    createPutawayOderAction,
    showScreenLoading,
    hideScreenLoading,
};

export default connect(mapStateToProps, mapDispatchToProps)(PutawayItem);
