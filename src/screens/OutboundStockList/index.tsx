import {DispatchProps, OwnProps, Props, StateProps, State} from "./types";
import React, {ReactElement} from "react";
// import Order from "../../../data/order/Order";
import {getOrdersAction} from '../../redux/actions/orders';
import {View, FlatList, ListRenderItemInfo, Text, TouchableOpacity} from "react-native";
import BarCodeSearchHeader from '../Products/BarCodeSearchHeader';

import {connect, useSelector} from "react-redux";
import {showScreenLoading, hideScreenLoading} from '../../redux/actions/main';
import {RootState} from "../../redux/reducers";
import showPopup from "../../components/Popup";
import styles from "./styles";
import {getShipmentsReadyToBePacked} from "../../redux/actions/packing";
import {Shipment} from "../../data/container/Shipment";
import Header from "../../components/Header";


class OutboundStockList extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props)
        this.state = {
            error: null,
            shipments: []
        }

    }

    componentDidMount() {
        this.fetchPackings(null);
    }


    fetchPackings = (query: any) => {
        const actionCallback = (data: any) => {
            console.log(55555555555, data)
            if (!data || data?.error) {
                const title = data.error.message ? "Failed to fetch Shipments Detail" : null
                const message = data.error.message ?? "Failed to fetch PutAway Detail with OrderNumber:" + query
                return Promise.resolve(null)
            } else {
                if (data?.length == 1){
                    // this.onPackingTapped(data[0])
                    // this.setState({
                    //     showList: true,
                    //     putAway: data[0],
                    //     putAwayList: data,
                    //     showDetail: true
                    // })
                }else{
                    this.setState({
                        shipments: data
                    })
                }
            }
            this.props.hideScreenLoading();
        };

        const {SelectedLocation} = this.props

        // const location = useSelector((state: RootState) => state.mainReducer.currentLocation)
        console.debug("SelectedLocation::>:>:>:>:"+SelectedLocation.id)
        this.props.getShipmentsReadyToBePacked(SelectedLocation.id, "PENDING", actionCallback)
    }



    showShipmentReadyToPackScreen = (shipment: Shipment) => {
        this.props.navigation.navigate('OutboundStockDetails', {shipmentId: shipment.id})
    }

    // renderItem = (item: ListRenderItemInfo<PutAwayItems>) => {
    //     return (
    //         <PutAwayItem
    //             item={item.item}
    //         />
    //     )
    // }
    //
    // goToPutawayItemDetailScreen = (putAway: PutAway, putAwayItem: PutAwayItems) => {
    //     this.props.navigation.navigate('PutawayItemDetail', {
    //         putAway: putAway,
    //         putAwayItem: putAwayItem,
    //     });
    // };
    // onPackingTapped = (putAway: PutAway) => {
    //     this.props.navigation.navigate('PutawayDetail', {
    //         // putAway,
    //         putAway: putAway,
    //         exit: () => {
    //             this.props.navigation.navigate('PutawayList');
    //         },
    //     });
    // };

    render() {
        // const {showList} = this.state
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
