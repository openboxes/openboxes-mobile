import React from 'react';
import {State, DispatchProps, Props} from './types';
import styles from './styles';
import Header from '../../components/Header';
import {Button, ScrollView, Text, TextInput, View} from 'react-native';
import {pickListVMMapper} from './PickListVMMapper';
import {showScreenLoading, hideScreenLoading} from '../../redux/actions/main';
import {connect} from 'react-redux';
import {ScreenContainer} from "react-native-screens";
import showPopup from "../../components/Popup";
import {getPickListItemAction, submitPickListItem} from '../../redux/actions/orders';
import {
    searchProductByCodeAction
} from '../../redux/actions/products';
import {searchLocationByLocationNumber} from "../../redux/actions/locations";


class PickOrderItem extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            error: null,
            pickListItem: null,
            order: null,
            productSearchQuery: "",
            binLocationSearchQuery: "",
            quantityPicked: "0",
            product: null,
            binLocation: null,
        };
    }

    componentDidMount() {
        this.getPickListItem()
    }

    // @ts-ignore
    async getPickListItem(): Promise<PicklistItem> {
        try {
            // this.props.showProgressBar("Fetching PickList Item")
            const {pickListItem} = this.props.route.params;
            const actionCallback = (data: any) => {
                if (data?.length == 0) {
                    this.setState({
                        pickListItem: data,
                        error: 'No Picklist found',
                    });
                } else {
                    this.setState({
                        pickListItem: data,
                        error: null,
                    });
                }
            };
            console.debug("this.props.pickListItem?.id::")
            console.debug(this.props.pickListItem?.id)
            console.debug(pickListItem?.id)
            this.props.getPickListItemAction(pickListItem?.id, actionCallback);
        } catch (e) {

        }
    }

    formSubmit = () => {
        try {
            let errorTitle = ""
            let errorMessage = ""
            if (this.state.product == null) {
                errorTitle = "Product Code!"
                errorMessage = "Please scan Product Code."
            } else if (this.state.quantityPicked == null || this.state.quantityPicked == "") {
                errorTitle = "Quantity Pick!"
                errorMessage = "Please pick some quantity."
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
                "product.id": this.state.product?.id,
                "productCode": this.state.product?.productCode,
                "inventoryItem.id": null,
                "binLocation.id": this.state.binLocation?.id,
                "binLocation.locationNumber": this.state.binLocation?.locationNumber ? this.state.binLocation?.locationNumber : this.state.binLocationSearchQuery,
                "quantityPicked": this.state.quantityPicked,
                "picker.id": null,
                "datePicked": null,
                "reasonCode": null,
                "comment": null,
                "forceUpdate": false
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
            this.props.submitPickListItem(this.state.pickListItem?.id as string, requestBody, actionCallback);
        } catch (e) {
            const title = e.message ? "Failed submit item" : null
            const message = e.message ?? "Failed submit item"
            const shouldRetry = showPopup({
                title: title,
                message: message,
                // positiveButtonText: "Retry",
                negativeButtonText: "Cancel"
            })
            return Promise.resolve(null)
        } finally {
        }
    }

    productSearchQueryChange = (query: string) => {
        this.setState({
            productSearchQuery: query
        })
    }

    onProductBarCodeSearchQuerySubmitted = () => {

            if (!this.state.productSearchQuery) {
                showPopup({
                    message: "Search query is empty",
                    positiveButton: {
                        text: 'Ok'
                    }
                })
                return
            }


            const actionCallback = (data: any) => {
                console.debug("product searched completed")
                console.debug(data.data.length)
                if (!data || data.data.length == 0) {
                    showPopup({
                        message: "Product not found with ProductCode:" + this.state.productSearchQuery,
                        positiveButton: {
                            text: 'Ok'
                        }
                    })
                    return
                } else if (data.data.length == 1) {
                    console.debug("data.length")
                    console.debug(data.length)
                    this.setState({
                        product: data.data[0],
                        quantityPicked: parseInt(this.state.quantityPicked) + 1 + "",
                        productSearchQuery: ""
                    })
                }
            }
            this.props.searchProductByCodeAction(this.state.productSearchQuery, actionCallback);


            /*let searchedProducts = await searchProductCodeFromApi(this.state.productSearchQuery)

            */
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

    binLocationSearchQueryChange = (query: string) => {
        this.setState({
            binLocationSearchQuery: query
        })
    }

    quantityPickedChange = (query: string) => {
        this.setState({
            quantityPicked: query
        })
    }

    render() {
        const vm = pickListVMMapper(this.props.route.params, this.state);
        return (
            <ScrollView>

                    {/*<Header
                        title={vm.header}
                        backButtonVisible={true}
                        onBackButtonPress={this.props.exit}
                    />*/}
                    <View style={styles.contentContainer}>
                        <View style={styles.topRow}>
                            <Text style={styles.name}>{this.state.pickListItem?.["product.name"]}</Text>
                        </View>
                        <View style={styles.row}>
                            <View style={styles.col40}>
                                <Text style={styles.value}>Order Number</Text>
                            </View>
                            <View style={styles.col60}>
                                <Text style={styles.value}>{vm.order.identifier}</Text>
                            </View>
                        </View>
                        <View style={styles.row}>
                            <View style={styles.col40}>
                                <Text style={styles.value}>Destination</Text>
                            </View>
                            <View style={styles.col60}>
                                <Text style={styles.value}>{vm.order.destination?.name}</Text>
                            </View>
                        </View>
                        <View style={styles.row}>
                            <View style={styles.col40}>
                                <Text style={styles.value}>Product Code</Text>
                            </View>
                            <View style={styles.col60}>
                                <Text style={styles.value}>{this.state.pickListItem?.productCode}</Text>
                            </View>
                        </View>
                        <View style={styles.row}>
                            <View style={styles.col40}>
                                <Text style={styles.value}>Product Name</Text>
                            </View>
                            <View style={styles.col60}>
                                <Text style={styles.value}>{this.state.pickListItem?.["product.name"]}</Text>
                            </View>
                        </View>
                        <View style={styles.row}>
                            <View style={styles.col40}>
                                <Text style={styles.value}>Unit of Measure</Text>
                            </View>
                            <View style={styles.col60}>
                                <Text style={styles.value}>{this.state.pickListItem?.unitOfMeasure}</Text>
                            </View>
                        </View>
                        <View style={styles.row}>
                            <View style={styles.col40}>
                                <Text style={styles.value}>Lot Number</Text>
                            </View>
                            <View style={styles.col60}>
                                <Text style={styles.value}>{this.state.pickListItem?.lotNumber}</Text>
                            </View>
                        </View>
                        <View style={styles.row}>
                            <View style={styles.col40}>
                                <Text style={styles.value}>Expiration</Text>
                            </View>
                            <View style={styles.col60}>
                                <Text style={styles.value}>{this.state.pickListItem?.expirationDate}</Text>
                            </View>
                        </View>
                        <View style={styles.row}>
                            <View style={styles.col40}>
                                <Text style={styles.value}>Bin Location</Text>
                            </View>
                            <View style={styles.col60}>
                                <Text style={styles.value}>{this.state.pickListItem?.["binLocation.name"]}</Text>
                            </View>
                        </View>
                        <View style={styles.row}>
                            <View style={styles.col40}>
                                <Text style={styles.value}>Qty Requested</Text>
                            </View>
                            <View style={styles.col60}>
                                <Text style={styles.value}>{this.state.pickListItem?.quantityRequested}</Text>
                            </View>
                        </View>
                        <View style={styles.row}>
                            <View style={styles.col40}>
                                <Text style={styles.value}>Qty Remaining</Text>
                            </View>
                            <View style={styles.col60}>
                                <Text style={styles.value}>{this.state.pickListItem?.quantityRemaining}</Text>
                            </View>
                        </View>
                        <View style={styles.row}>
                            <View style={styles.col40}>
                                <Text style={styles.value}>Qty Picked</Text>
                            </View>
                            <View style={styles.col60}>
                                <Text style={styles.value}>{this.state.pickListItem?.quantityPicked}</Text>
                            </View>
                        </View>


                        <View style={styles.emptyRow}>

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
                        <View style={styles.row}>
                            <View style={styles.col40}>
                                <Text style={styles.value}>Product Code</Text>
                            </View>
                            <View style={styles.col60}>
                                <TextInput
                                    placeholder="Scan Product"
                                    onChangeText={this.productSearchQueryChange}
                                    value={this.state.productSearchQuery}
                                    style={styles.value}
                                    onSubmitEditing={this.onProductBarCodeSearchQuerySubmitted}
                                />
                                {this.state.product != null ? <Text
                                    style={styles.info}>{this.state.product?.productCode}-{this.state.product?.description}</Text> : null}
                            </View>
                        </View>
                        <View style={styles.row}>
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
                        </View>

                        {/*<View style={styles.row}>
                            <View style={styles.col40}>
                                <Text style={styles.label}>Qty Available</Text>
                                <Text style={styles.value}>{this.state.pickListItem?.quantityAvailable}</Text>
                            </View>
                            <View style={styles.col60}>
                                <Text style={styles.label}>Qty Picked</Text>
                                <TextInput style={styles.textInput} placeholder="Qty Picked"
                                           value={this.state.pickListItem?.quantityPicked.toString()}/>
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

            </ScrollView>
        );
    }
}

const mapDispatchToProps: DispatchProps = {
    showScreenLoading,
    hideScreenLoading,
    getPickListItemAction,
    submitPickListItem,
    searchProductByCodeAction,
    searchLocationByLocationNumber,
};
export default connect(null, mapDispatchToProps)(PickOrderItem);
