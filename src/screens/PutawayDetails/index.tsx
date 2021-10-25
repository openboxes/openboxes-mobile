import React, {ReactElement} from "react";
import {DispatchProps, OwnProps, Props, StateProps} from "./Props";
import {NavigationStateHere, NavigationStatePutAwayDetail, NavigationStateType, State} from "./State";
import {connect} from "react-redux";
import styles from "./styles";
import {showScreenLoading, hideScreenLoading} from '../../redux/actions/main';
import ScreenContainer from "../../ScreenContainer";
import Header from "../../components/Header";
import {FlatList, ListRenderItemInfo, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import Theme from "../../utils/Theme";
import * as vm from "vm";
import PutAwayItems from "../../data/putaway/PutAwayItems";
import {fetchPutAwayFromOrderAction} from '../../redux/actions/putaways'

class PutawayDetails extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props)
        this.state = {
            error: null,
            putAway: null,
            orderId: null,
            navigationState: new NavigationStateHere()
        }
        this.fetchPutAway = this.fetchPutAway.bind(this)
        this.renderContent = this.renderContent.bind(this)

    }

    componentDidMount() {
        (async () => {
            await this.fetchPutAway()
        })()
    }

    async fetchPutAway() {
        let putAwayObj = null
        try {
            this.props.showScreenLoading("Fetching PutAway Detail")
            putAwayObj = await fetchPutAwayFromOrderAction(this.props.orderId)
            this.setState({
                putAway: putAwayObj
            })
        } catch (e) {
            const title = e.message ? "Failed to fetch PutAway Detail" : null
            const message = e.message ?? "Failed to fetch PutAway Detail"
            return Promise.resolve(null)
        } finally {
            this.props.hideScreenLoading()
        }
    }

    render() {
        const vm = this.state
        switch (this.state.navigationState.type) {
            case NavigationStateType.Here:
                return this.renderContent();
            // case NavigationStateType.PutAwayToBinLocation:
            //   const navigationStateOrderDetails = vm.navigationState as NavigationStatePutAwayDetail
            //   return this.renderPutAwayDetailScreen(navigationStateOrderDetails.order);
        }
    }

    renderContent() {
        return (
            <View style={styles.screenContainer}>
                <Header
                    title={'PutAway Details'}
                    backButtonVisible={true}
                    onBackButtonPress={this.props.exit}
                />
                <View style={styles.contentContainer}>
                    {/*<Text style={styles.name}>{vm.name}</Text>*/}
                    <View style={styles.row}>
                        <View style={styles.col50}>
                            <Text style={styles.label}>Status</Text>
                            <Text style={styles.value}>{this.state.putAway?.putawayStatus}</Text>
                        </View>
                        <View style={styles.col50}>
                            <Text style={styles.label}>PutAway Number</Text>
                            <Text style={styles.value}>{this.state.putAway?.putawayNumber}</Text>
                        </View>

                    </View>
                    <View style={styles.row}>
                        <View style={styles.col50}>
                            <Text style={styles.label}>Origin</Text>
                            <Text
                                style={styles.value}>{this.state.putAway?.["origin.name"]}</Text>
                        </View>
                        <View style={styles.col50}>
                            <Text style={styles.label}>Destination</Text>
                            <Text
                                style={styles.value}>{this.state.putAway?.["destination.name"]}</Text>
                        </View>
                    </View>
                    <FlatList
                        data={this.state.putAway?.putawayItems}
                        renderItem={(item: ListRenderItemInfo<PutAwayItems>) => renderPutAwayItem(item.item, () => this.onItemTapped(this.props.order, item.item))}
                        keyExtractor={item => item.id}
                        style={styles.list}
                    />
                </View>
            </View>);
    }
}

function renderPutAwayItem(
    item: PutAwayItems,
    onItemTapped: () => void
): ReactElement {
    return (
        <TouchableOpacity
            style={styles.listItemContainer}
            onPress={() => onItemTapped()}
        >
            <View style={styles.row}>
                <View style={styles.col50}>
                    <Text style={styles.label}>Id</Text>
                    <Text style={styles.value}>{item.id}</Text>
                </View>
                <View style={styles.col50}>
                    <Text style={styles.label}>Product Name</Text>
                    <Text style={styles.value}>{item["product.name"]}</Text>
                </View>
            </View>
            <View style={styles.row}>
                <View style={styles.col50}>
                    <Text style={styles.label}>Current Location</Text>
                    <Text style={styles.value}>{item["currentLocation.id"]}-{item["currentLocation.name"]}</Text>
                </View>
                <View style={styles.col50}>
                    <Text style={styles.label}>Putaway Location</Text>
                    <Text style={styles.value}>{item["putawayLocation.id"]}-{item["putawayLocation.name"]}</Text>
                </View>
            </View>
            <View style={styles.row}>
                <View style={styles.col50}>
                    <Text style={styles.label}>Qty</Text>
                    <Text style={styles.value}>{item.quantity}</Text>
                </View>
                <View style={styles.col50}>
                    <Text style={styles.label}>Qty Available</Text>
                    <Text style={styles.value}>{item.quantityAvailable}</Text>
                </View>
            </View>
        </TouchableOpacity>
    )
}

const mapDispatchToProps: DispatchProps = {
    showScreenLoading,
    hideScreenLoading
}

export default connect(null, mapDispatchToProps)(PutawayDetails)
