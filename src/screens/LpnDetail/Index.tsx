import React from "react";
import {DispatchProps, Props} from "./Types";
import {Container} from "../../data/container/Container";
import {FlatList, ListRenderItemInfo, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import Theme from "../../utils/Theme";
import {ContainerShipmentItem} from "../../data/container/ContainerShipmentItem";
import {fetchContainer} from "../../redux/actions/lpn";
import {getShipmentPacking} from "../../redux/actions/packing";
import {connect} from "react-redux";
import styles from "./styles";

export interface State {
    container: Container | null
}

class LpnDetail extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            container: null
        }
    }

    componentDidMount() {
        console.debug("Did mount with Container details")
        const {id} = this.props.route.params
        console.debug("id::::>" + id)
        this.fetchContainerDetail(id)
    }

    fetchContainerDetail = (id: string) => {
        const actionCallback = (data: any) => {
            console.log("Details Data", data)
            const {shipmentNumber} = this.props.route.params
            data.shipmentNumber = shipmentNumber;
            this.setState({
                container: data,
            });
        }
        this.props.fetchContainer(id, actionCallback);
    }

    onTapped = (shipmentItem: ListRenderItemInfo<ContainerShipmentItem>) => {
        this.props.navigation.navigate("Packing", {shipment: shipmentItem})
    }

    render() {
        return (
            <TouchableOpacity
                style={styles.contentContainer}
            >
                <View style={styles.row}>
                    <View style={styles.col50}>
                        <Text style={styles.label}>Shipment Number</Text>
                        <Text style={styles.value}>{this.state.container?.shipmentNumber}</Text>
                    </View>
                    <View style={styles.col50}>
                        <Text style={styles.label}>Name</Text>
                        <Text style={styles.value}>{this.state.container?.name}</Text>
                    </View>

                </View>

                <View style={styles.row}>
                    <View style={styles.col50}>
                        <Text style={styles.label}>Container Number</Text>
                        <Text style={styles.value}>{this.state.container?.containerNumber}</Text>
                    </View>
                    <View style={styles.col50}>
                        <Text style={styles.label}>Container Type</Text>
                        <Text style={styles.value}>{this.state.container?.containerType?.name}</Text>
                    </View>
                </View>
                <View style={styles.row}>
                    <View style={styles.col50}>
                        <Text style={styles.label}>Number of Items</Text>
                        <Text style={styles.value}>{this.state.container?.shipmentItems?.length}</Text>
                    </View>
                </View>
                {
                    <FlatList
                        data={this.state.container?.shipmentItems}
                        renderItem={(shipmentItem: ListRenderItemInfo<ContainerShipmentItem>) =>
                            (
                                <TouchableOpacity
                                    style={styles.listItemContainer}
                                    onPress={() => this.onTapped(shipmentItem)}
                                >
                                    <View style={styles.row}>
                                        <View style={styles.col50}>
                                            <Text style={styles.label}>Product Code</Text>
                                            <Text
                                                style={styles.value}>{shipmentItem.item?.inventoryItem?.product?.productCode}</Text>
                                        </View>
                                        <View style={styles.col50}>
                                            <Text style={styles.label}>Product</Text>
                                            <Text
                                                style={styles.value}>{shipmentItem.item?.inventoryItem?.product?.name}</Text>
                                        </View>

                                    </View>
                                    <View style={styles.row}>
                                        <View style={styles.col50}>
                                            <Text style={styles.label}>Quantity</Text>
                                            <Text
                                                style={styles.value}>{shipmentItem.item.quantity}</Text>
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
                }

            </TouchableOpacity>

        );
    }
}

const mapDispatchToProps: DispatchProps = {
    fetchContainer,
    getShipmentPacking
}

export default connect(null, mapDispatchToProps)(LpnDetail);

