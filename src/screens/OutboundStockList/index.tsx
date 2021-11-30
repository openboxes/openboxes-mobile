import {DispatchProps, Props, State} from "./types";
import React from "react";
import {FlatList, ListRenderItemInfo, Text, TouchableOpacity, View} from "react-native";
import {hideScreenLoading, showScreenLoading} from '../../redux/actions/main';
import {RootState} from "../../redux/reducers";
import showPopup from "../../components/Popup";
import styles from "./styles";
import {getShipmentsReadyToBePacked} from "../../redux/actions/packing";
import {Shipment} from "../../data/container/Shipment";
import {connect} from "react-redux";


class OutboundStockList extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props)
        this.state = {
            error: null,
            shipments: []
        }

    }

    componentDidMount() {
        this.fetchPacking(null);
    }


    fetchPacking = (query: any) => {
        const actionCallback = (data: any) => {
            const callback = (data: any) => {
                if (data?.error) {
                    showPopup({
                        title: data.errorMessage
                            ? `Shipment details`
                            : null,
                        message:
                            data.errorMessage ??
                            `Failed to submit shipment details`,
                        positiveButton: {
                            text: 'Retry',
                            callback: () => {
                                this.props.getShipmentsReadyToBePacked(SelectedLocation.id, "PENDING", actionCallback)
                            },
                        },
                        negativeButtonText: 'Cancel',
                    });
                } else {
                    if (data?.length == 1) {
                        // this.onPackingTapped(data[0])
                        // this.setState({
                        //     showList: true,
                        //     putAway: data[0],
                        //     putAwayList: data,
                        //     showDetail: true
                        // })
                    } else {
                        this.setState({
                            shipments: data
                        })
                    }
                }
                this.props.hideScreenLoading();
            };

            const {SelectedLocation} = this.props

            // const location = useSelector((state: RootState) => state.mainReducer.currentLocation)
            console.debug("SelectedLocation::>:>:>:>:" + SelectedLocation.id)
            this.props.getShipmentsReadyToBePacked(SelectedLocation.id, "PENDING", actionCallback)
        }
    }


    showShipmentReadyToPackScreen = (shipment: Shipment) => {
        this.props.navigation.navigate('OutboundStockDetails', {shipmentId: shipment.id})
    }

    render() {
        return (
            <View style={styles.screenContainer}>

                <View style={styles.contentContainer}>
                    <FlatList
                        data={this.state.shipments}
                        renderItem={(shipment: ListRenderItemInfo<Shipment>) =>
                            (
                                <TouchableOpacity
                                    style={styles.listItemContainer}
                                    onPress={() => this.showShipmentReadyToPackScreen(shipment.item)}
                                >
                                    <View style={styles.row}>
                                        <View style={styles.col50}>
                                            <Text style={styles.label}>Shipment Number</Text>
                                            <Text style={styles.value}>{shipment.item.shipmentNumber}</Text>
                                        </View>
                                        <View style={styles.col50}>
                                            <Text style={styles.label}>Status</Text>
                                            <Text style={styles.value}>{shipment.item.status}</Text>
                                        </View>

                                    </View>
                                    <View style={styles.row}>
                                        <View style={styles.col50}>
                                            <Text style={styles.label}>Origin</Text>
                                            <Text
                                                style={styles.value}>{shipment.item.origin.name}</Text>
                                        </View>
                                        <View style={styles.col50}>
                                            <Text style={styles.label}>Destination</Text>
                                            <Text
                                                style={styles.value}>{shipment.item.destination.name}</Text>
                                        </View>
                                    </View>
                                    <View style={styles.row}>
                                        <View style={styles.col50}>
                                            <Text style={styles.label}>Expected Shipping Date</Text>
                                            <Text
                                                style={styles.value}>{shipment.item.expectedShippingDate}</Text>
                                        </View>
                                        <View style={styles.col50}>
                                            <Text style={styles.label}>Expected Delivery Date</Text>
                                            <Text
                                                style={styles.value}>{shipment.item.expectedDeliveryDate}</Text>
                                        </View>
                                    </View>

                                </TouchableOpacity>
                            )
                        }
                        // renderItem={(item: ListRenderItemInfo<PutAwayItems>) => renderPutAwayItem(item.item, () => this.onItemTapped(this.props.order, item.item))}
                        // renderItem={this.renderItem}
                        keyExtractor={item => item.id}
                        style={styles.list}
                    />

                </View>
            </View>
        )
    }

}

/*function renderPutAway(putAway: PutAway): ReactElement {
    return (
        <TouchableOpacity
            style={styles.listItemContainer}>
            <View style={styles.row}>
                <View style={styles.col50}>
                    <Text style={styles.label}>Status</Text>
                    <Text style={styles.value}>{putAway?.putawayStatus}</Text>
                </View>
                <View style={styles.col50}>
                    <Text style={styles.label}>PutAway Number</Text>
                    <Text style={styles.value}>{putAway?.putawayNumber}</Text>
                </View>

            </View>
            <View style={styles.row}>
                <View style={styles.col50}>
                    <Text style={styles.label}>Origin</Text>
                    <Text
                        style={styles.value}>{putAway?.["origin.name"]}</Text>
                </View>
                <View style={styles.col50}>
                    <Text style={styles.label}>Destination</Text>
                    <Text
                        style={styles.value}>{putAway?.["destination.name"]}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );
}*/

const mapStateToProps = (state: RootState) => ({
    SelectedLocation: state.locationsReducer.SelectedLocation,
});

const mapDispatchToProps: DispatchProps = {
    showScreenLoading,
    hideScreenLoading,
    getShipmentsReadyToBePacked
}
export default connect(mapStateToProps, mapDispatchToProps)(OutboundStockList);
