import {DispatchProps, Props, State} from "./types";
import React from "react";
import {TouchableOpacity, View, Text, TextInput, Button} from "react-native";
import styles from './styles';
import showPopup from "../../components/Popup";
import {searchLocationByLocationNumber} from "../../redux/actions/locations";
import {hideScreenLoading, showScreenLoading} from "../../redux/actions/main";
import {connect} from "react-redux";
import {submitPutawayItem} from "../../redux/actions/putaways";

class PutawayItemDetail extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props)
        this.state = {
            error: null,
            putAway: null,
            putAwayItem: null,
            orderId: null,
            binLocationSearchQuery: null,
            binLocation: null,
            quantityPicked: "0",
        }
    }

    componentDidMount() {
        const {putAway, putAwayItem} = this.props.route.params;
        this.setState({
            putAway: putAway,
            putAwayItem: putAwayItem
        })
    }

    onBinLocationBarCodeSearchQuerySubmitted = () => {

        if (!this.state.binLocationSearchQuery) {
            showPopup({
                message: "Search query is empty",
                positiveButton: {
                    text: 'Ok'
                }
            })
            return
        }

        const actionCallback = (location: any) => {
            if (!location || location.error) {
                showPopup({
                    message: "Bin Location not found with LocationNumber:" + this.state.binLocationSearchQuery,
                    positiveButton: {
                        text: 'Ok'
                    }
                })
                return
            } else if (location) {
                this.setState({
                    binLocation: location,
                    binLocationSearchQuery: ""
                })
            }
        }
        this.props.searchLocationByLocationNumber(this.state.binLocationSearchQuery, actionCallback)
    }

    quantityPickedChange = (query: string) => {
        this.setState({
            quantityPicked: query
        })
    }
    binLocationSearchQueryChange = (query: string) => {
        this.setState({
            binLocationSearchQuery: query
        })
    }

    formSubmit = () => {
        let errorTitle = ""
        let errorMessage = ""
        if (this.state.binLocation == null) {
            errorTitle = "Bin Location!"
            errorMessage = "Please scan Bin Location."
        }
        if (errorTitle != "") {
            showPopup({
                title: errorTitle,
                message: errorMessage,
                // positiveButtonText: "Retry",
                negativeButtonText: "Cancel"
            })
            return Promise.resolve(null)
        }

        const requestBody = {
            "id": this.state.putAway?.id,
            "putawayNumber": this.state.putAway?.putawayNumber,
            "putawayStatus": this.state.putAway?.putawayStatus,
            "putawayDate": this.state.putAway?.putawayDate,
            "putawayAssignee": "",
            "origin.id": this.state.putAway?.["origin.id"],
            "destination.id": this.state.putAway?.["destination.id"],
            "putawayItems": [
                {
                    "id": this.state.putAwayItem?.id,
                    "putawayStatus": this.state.putAway?.putawayStatus,
                    "currentLocation.id": this.state.putAwayItem?.["currentLocation.id"],
                    "product.id": this.state.putAwayItem?.["product.id"],
                    "inventoryItem.id": this.state.putAwayItem?.["inventoryItem.id"],
                    "putawayFacility.id": this.state.putAwayItem?.["putawayFacility.id"],
                    "putawayLocation.id": this.state.binLocation?.id,
                    "quantity": this.state.putAwayItem?.quantity
                }
            ],
            "orderedBy.id": "1",
            "sortBy": null
        }
        const actionCallback = (data: any) => {
            console.debug("data after submit")
            console.debug(data)
            if (data?.length == 0) {
                // this.setState({
                //     pickListItem: data,
                //     error: 'No Picklist found',
                // });
            } else {
                // this.setState({
                //     pickListItem: data,
                //     error: null,
                // });
            }
        }
        this.props.submitPutawayItem(this.state.putAwayItem?.id as string, requestBody, actionCallback);

    }

    render() {
        return (
            <View style={styles.contentContainer}>
                <View style={styles.row}>
                    <View style={styles.col40}>
                        <Text style={styles.value}>Status</Text>
                    </View>
                    <View style={styles.col60}>
                        <Text style={styles.value}>{this.state.putAway?.putawayStatus}</Text>
                    </View>
                </View>
                <View style={styles.row}>
                    <View style={styles.col40}>
                        <Text style={styles.value}>Putaway Number</Text>
                    </View>
                    <View style={styles.col60}>
                        <Text style={styles.value}>{this.state.putAway?.putawayNumber}</Text>
                    </View>
                </View>
                <View style={styles.row}>
                    <View style={styles.col40}>
                        <Text style={styles.value}>Putaway Date</Text>
                    </View>
                    <View style={styles.col60}>
                        <Text style={styles.value}>{this.state.putAway?.putawayDate}</Text>
                    </View>
                </View>
                <View style={styles.row}>
                    <View style={styles.col40}>
                        <Text style={styles.value}>Origin Name</Text>
                    </View>
                    <View style={styles.col60}>
                        <Text style={styles.value}>{this.state.putAwayItem?.["currentLocation.name"]}</Text>
                    </View>
                </View>
                <View style={styles.row}>
                    <View style={styles.col40}>
                        <Text style={styles.value}>Destination Name</Text>
                    </View>
                    <View style={styles.col60}>
                        <Text style={styles.value}>{this.state.putAway?.["destination.name"]}</Text>
                    </View>
                </View>
                <View style={styles.row}>
                    <View style={styles.col40}>
                        <Text style={styles.value}>Preferred Location</Text>
                    </View>
                    <View style={styles.col60}>
                        <Text style={styles.value}>{this.state.putAwayItem?.["preferredBin.name"]}</Text>
                    </View>
                </View>
                <View style={styles.row}>
                    <View style={styles.col40}>
                        <Text style={styles.value}>Quantity</Text>
                    </View>
                    <View style={styles.col60}>
                        <Text style={styles.value}>{this.state.putAwayItem?.["quantity"]}</Text>
                    </View>
                </View>

                <View style={styles.row}>
                    <View style={styles.col40}>
                        <Text style={styles.value}>Product Name</Text>
                    </View>
                    <View style={styles.col60}>
                        <Text style={styles.value}>{this.state.putAwayItem?.["product.name"]}</Text>
                    </View>
                </View>
                <View style={styles.topRow}>
                    <View style={styles.col40}>
                        <Text style={styles.value}>Bin Location</Text>
                    </View>
                    <View style={styles.col60}>
                        <TextInput
                            placeholder="Scan Bin Location"
                            onChangeText={this.binLocationSearchQueryChange}
                            value={this.state.binLocationSearchQuery}
                            style={styles.value}
                            onSubmitEditing={this.onBinLocationBarCodeSearchQuerySubmitted}
                        />
                        {this.state.binLocation != null ? <Text
                            style={styles.info}>{this.state.binLocation?.locationNumber}-{this.state.binLocation?.name}</Text> : null}
                    </View>
                    <View style={styles.width100}>
                    </View>
                </View>
                {/*<View style={styles.row}>
                    <View style={styles.col40}>
                        <Text style={styles.value}>Quantity Picked</Text>
                    </View>
                    <View style={styles.col60}>
                        <TextInput
                            placeholder="Enter Picked Quantity"
                            onChangeText={this.quantityPickedChange}
                            value={this.state.quantityPicked}
                            style={styles.value}
                            // onSubmitEditing={this.onBarCodeSearchQuerySubmitted}
                        />
                    </View>
                </View>*/}
                <View>
                    <Button
                        title="Submit"
                        style={{
                            marginTop: 8,
                        }}
                        onPress={this.formSubmit}
                    />
                </View>

            </View>

        )
    }
}

const mapDispatchToProps: DispatchProps = {
    showScreenLoading,
    hideScreenLoading,
    searchLocationByLocationNumber,
    submitPutawayItem,
};
export default connect(null, mapDispatchToProps)(PutawayItemDetail);
