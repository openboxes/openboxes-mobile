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
import {getShipmentReadyToBePacked, getShipmentsReadyToBePacked} from "../../redux/actions/packing";
import {Shipment} from "../../data/container/Shipment";
import Header from "../../components/Header";
import {Container} from "../../data/container/Container";
import ContainerDetails from "./ContainerDetails";


class OutboundStockDetails extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props)
        this.state = {
            error: null,
            shipment: null
        }

    }

    componentDidMount() {
        this.fetchShipment();
    }


    fetchShipment = () => {
        const {shipmentId} = this.props.route.params;
        const actionCallback = (data: any) => {
            console.log("shipment details:", data)
            if (!data || data?.error) {
                const title = data.error.message ? "Failed to fetch Shipments Detail" : null
                const message = data.error.message ?? "Failed to fetch PutAway Detail with OrderNumber:"
                return Promise.resolve(null)
            } else {
                this.setState({
                    shipment: data
                })
            }
            this.props.hideScreenLoading();
        };
        this.props.getShipmentReadyToBePacked(shipmentId, actionCallback)
    }

    render() {
        // const {showList} = this.state
        return (
            <View style={styles.screenContainer}>
                <View style={styles.contentContainer}>
                    <View style={styles.row}>
                        <View style={styles.col50}>
                            <Text style={styles.label}>Shipment Number</Text>
                            <Text style={styles.value}>{this.state.shipment?.shipmentNumber}</Text>
                        </View>
                        <View style={styles.col50}>
                            <Text style={styles.label}>Status</Text>
                            <Text style={styles.value}>{this.state.shipment?.status}</Text>
                        </View>
                    </View>
                    <View style={styles.row}>
                        <View style={styles.col50}>
                            <Text style={styles.label}>Origin</Text>
                            <Text style={styles.value}>{this.state.shipment?.origin.name}</Text>
                        </View>
                        <View style={styles.col50}>
                            <Text style={styles.label}>Destination</Text>
                            <Text style={styles.value}>{this.state.shipment?.destination.name}</Text>
                        </View>
                    </View>
                    <View style={styles.row}>
                        <View style={styles.col50}>
                            <Text style={styles.label}>Expected Shipping Date</Text>
                            <Text style={styles.value}>{this.state.shipment?.expectedShippingDate}</Text>
                        </View>
                        <View style={styles.col50}>
                            <Text style={styles.label}>Expected Delivery Date</Text>
                            <Text style={styles.value}>{this.state.shipment?.expectedDeliveryDate}</Text>
                        </View>
                    </View>
                    <View style={styles.row}>
                        <View style={styles.col50}>
                            <Text style={styles.label}>Number of items</Text>
                            <Text style={styles.value}>{this.state.shipment?.shipmentItems.length}</Text>
                        </View>
                    </View>
                    <FlatList
                        data={this.state.shipment?.containers}
                        renderItem={(container: ListRenderItemInfo<Container>) => (
                            <ContainerDetails
                                item={container.item}
                                // onPress={() => {
                                //     this.onItemTapped(item.item);
                                // }}
                            />
                        )}
                        keyExtractor={item => `${item.id}`}
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
    getShipmentReadyToBePacked
}
export default connect(mapStateToProps, mapDispatchToProps)(OutboundStockDetails);
