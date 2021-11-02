import React from "react";
import {DispatchProps, Props} from "./Types";
import {Container} from "../../data/container/Container";
import {FlatList, ListRenderItemInfo, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import Theme from "../../utils/Theme";
import PutAwayItems from "../../data/putaway/PutAwayItems";
import PutAwayItem from "../../components/PutAwayItem";
import ShipmentItems from "../../data/inbound/ShipmentItems";
import PutAway from "../../data/putaway/PutAway";
import {ContainerShipmentItem} from "../../data/container/ContainerShipmentItem";
import {getStockMovements} from "../../redux/actions/orders";
import {fetchContainer, saveAndUpdateLpn} from "../../redux/actions/lpn";
import {connect} from "react-redux";

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
        console.debug("id::::>"+id)
        this.fetchContainerDetail(id)
    }

    fetchContainerDetail = (id: string) => {
        const actionCallback = (data: any) => {
            this.setState({
                container: data,
            });
        }
        this.props.fetchContainer(id, actionCallback);
    }

    render() {
        return (
            <TouchableOpacity
                style={styles.contentContainer}
            >
                <View style={styles.row}>
                    <View style={styles.col50}>
                        <Text style={styles.label}>Id</Text>
                        <Text style={styles.value}>{this.state.container?.id}</Text>
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
                {
                    <FlatList
                        data={this.state.container?.shipmentItems}
                        renderItem={(shipmentItem: ListRenderItemInfo<ContainerShipmentItem>) =>
                            (
                                <TouchableOpacity
                                    style={styles.listItemContainer}
                                    // onPress={() => this.onPutAwayTapped(item.item)}
                                >
                                    <View style={styles.row}>
                                        <View style={styles.col50}>
                                            <Text style={styles.label}>Id</Text>
                                            <Text style={styles.value}>{shipmentItem.item.id}</Text>
                                        </View>
                                        <View style={styles.col50}>
                                            <Text style={styles.label}>Product</Text>
                                            <Text style={styles.value}>{shipmentItem.item?.inventoryItem?.product?.name}</Text>
                                        </View>

                                    </View>
                                    <View style={styles.row}>
                                        <View style={styles.col50}>
                                            <Text style={styles.label}>Shipment</Text>
                                            <Text
                                                style={styles.value}>{shipmentItem.item.shipment?.name}</Text>
                                        </View>
                                        <View style={styles.col50}>
                                            <Text style={styles.label}>Recipient</Text>
                                            <Text
                                                style={styles.value}>{shipmentItem.item.recipient?.firstName} {shipmentItem.item.recipient?.lastName}</Text>
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
    fetchContainer
}

export default connect(null, mapDispatchToProps)(LpnDetail);

const styles = StyleSheet.create({
    contentContainer: {
        display: "flex",
        flex: 1,
        flexDirection: "column",
        padding: 8,
    },
    list: {
        width: '100%',
    },
    listItemContainer: {
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        borderRadius: Theme.roundness,
        borderColor: Theme.colors.backdrop,
        borderWidth: 1,
        margin: 4,
        padding: 4,
        justifyContent: 'center',
    },
    listItemNameContainer: {
        display: 'flex',
        flexDirection: 'column',
        flex: 0,
        marginStart: 4,
    },
    listItemNameLabel: {
        fontSize: 12,
        color: Theme.colors.placeholder,
    },
    listItemName: {
        fontSize: 16,
        color: Theme.colors.text,
    },
    listItemCategoryContainer: {
        display: 'flex',
        flexDirection: 'column',
        flex: 0,
        marginStart: 4,
        marginTop: 4,
    },
    listItemCategoryLabel: {
        fontSize: 12,
        color: Theme.colors.placeholder,
    },
    listItemCategory: {
        fontSize: 16,
        color: Theme.colors.text,
    },
    row: {
        flexDirection: 'row',
        borderColor: Theme.colors.background,
        // borderBottomWidth: 1,
        marginTop: 1,
        padding: 2,
        width: '100%',
    },
    col50: {
        display: 'flex',
        flexDirection: 'column',
        flex: 0,
        marginStart: 4,
        width: '50%',
    },
    label: {
        fontSize: 12,
        color: Theme.colors.placeholder,
    },
    value: {
        fontSize: 16,
        color: Theme.colors.text,
    },
});
