import {DispatchProps, OwnProps, Props, StateProps, State} from "./types";
import React, {ReactElement} from "react";
// import Order from "../../../data/order/Order";
import {getOrdersAction} from '../../redux/actions/orders';
import {View, FlatList, ListRenderItemInfo, Text, TouchableOpacity} from "react-native";
import BarCodeSearchHeader from '../Products/BarCodeSearchHeader';

import {connect} from "react-redux";
import {showScreenLoading, hideScreenLoading} from '../../redux/actions/main';
import {RootState} from "../../redux/reducers";
import showPopup from "../../components/Popup";
import styles from "./styles";
import PutAwayItem from "../../components/PutAwayItem";
import PutAwayItems from "../../data/putaway/PutAwayItems";
import {fetchPutAwayFromOrderAction} from "../../redux/actions/putaways";
import {Order} from "../../data/order/Order";
import PutAway from "../../data/putaway/PutAway";
import {PicklistItem} from "../../data/picklist/PicklistItem";
import PickListItem from "../OrderDetails/PickListItem";
import OrdersList from "../Orders/OrdersList";
import PutawayDetail from "../../components/PutawayDetail";


class PutawayList extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props)
        this.state = {
            error: null,
            putAwayList: null,
            putAway: null,
            orderId: null,
            showList: false,
            showDetail:false
        }

    }
    componentDidMount() {
        this.searchOrder("")
    }

    componentDidMount() {
        this.fetchPutAways(null);
    }

    searchOrder = (query: string) => {

        this.fetchPutAways(query)
        const actionCallback = (data: any) => {
            if (!data || data?.error) {
                showPopup({
                    title: data.error.message ? 'Failed to fetch Order' : null,
                    message: data.error.message ?? 'Failed to fetch Order with:'+query,
                    positiveButton: {
                        text: 'Retry',
                        callback: () => {
                            this.props.getOrdersAction(query, actionCallback);
                        },
                    },
                    negativeButtonText: 'Cancel',
                });
            } else {
                if (data.length == 0) {
                    showPopup({
                        title: data.error.message ? 'Failed to fetch Order' : null,
                        message: data.error.message ?? 'Failed to fetch Order with:'+query,
                        positiveButton: {
                            text: 'OK'
                        },
                    });
                    this.setState({
                        error: "No orders found",
                    })
                } else if (data.length == 1) {
                    console.log(333333333, data)
                    this.fetchPutAway(data[0]['id'])
                    // this.setState({showList: true})
                    // this.showPutAwayDetailsScreen(data[0])
                } else {
                    console.debug("orders found::" + data.length)
                    this.setState({
                        error: null,
                    })
                    //this.showPutAwayDetailsScreen(orders[0])
                }
            }
            this.props.hideScreenLoading();
        };
        this.props.getOrdersAction(query, actionCallback);
        // this.fetchPutAway(query)
    }

    fetchPutAways = (query: any) => {
        const actionCallback = (data: any) => {
            console.log(55555555555, data)
            if (!data || data?.error) {
                const title = data.error.message ? "Failed to fetch PutAway Detail" : null
                const message = data.error.message ?? "Failed to fetch PutAway Detail with OrderNumber:" + query
                return Promise.resolve(null)
            } else {
                if (data?.length == 1){
                    this.onPutAwayTapped(data[0])
                    // this.setState({
                    //     showList: true,
                    //     putAway: data[0],
                    //     putAwayList: data,
                    //     showDetail: true
                    // })
                }else{
                    this.setState({
                        showList: true,
                        putAwayList: data,
                        putAway: null
                    })
                }
            }
            this.props.hideScreenLoading();
        };

        this.props.fetchPutAwayFromOrderAction(query, actionCallback)
    }

    // showPutAwayListScreen =()=> {
    //   console.debug(">>>>> showPutAwayListScreen")
    //   this.setState({
    //     navigationState: new NavigationStateHere()
    //   })
    // }

    // showPutAwayDetailsScreen = (order: Order) => {
    //     this.props.navigation.navigate('PutAwayDetails', {orderId: order.id})
    // }

    renderItem = (item: ListRenderItemInfo<PutAwayItems>) => {
        return (
            <PutAwayItem
                item={item.item}
            />
        )
    }

    goToPutawayItemDetailScreen = (putAway: PutAway, putAwayItem: PutAwayItems) => {
        this.props.navigation.navigate('PutawayItemDetail', {
            putAway: putAway,
            putAwayItem: putAwayItem,
        });
    };
    onPutAwayTapped = (putAway: PutAway) => {
        this.props.navigation.navigate('PutawayDetail', {
            // putAway,
            putAway: putAway,
            exit: () => {
                this.props.navigation.navigate('PutawayList');
            },
        });
    };

    render() {
        const {showList} = this.state
        return (
            <View style={styles.screenContainer}>
                {/*<Header*/}
                {/*  title="PutAway List"*/}
                {/*  subtitle={'All Pending Put Away List'}*/}
                {/*  backButtonVisible={true}*/}
                {/*  onBackButtonPress={this.onBackButtonPress}*/}
                {/*/>*/}
                <BarCodeSearchHeader
                    onBarCodeSearchQuerySubmitted={this.searchOrder}
                    placeHolder={'Search Orders by Name'}
                    searchBox={false}
                />
                {
                    showList ?
                        (

                            <View style={styles.contentContainer}>
                                <FlatList
                                    data={this.state.putAwayList}
                                    renderItem={(item: ListRenderItemInfo<PutAway>) =>
                                        (
                                            <TouchableOpacity
                                                style={styles.listItemContainer}
                                                onPress={() => this.onPutAwayTapped(item.item)}
                                            >
                                                <View style={styles.row}>
                                                    <View style={styles.col50}>
                                                        <Text style={styles.label}>Status</Text>
                                                        <Text style={styles.value}>{item.item?.putawayStatus}</Text>
                                                    </View>
                                                    <View style={styles.col50}>
                                                        <Text style={styles.label}>PutAway Number</Text>
                                                        <Text style={styles.value}>{item.item?.putawayNumber}</Text>
                                                    </View>

                                                </View>
                                                <View style={styles.row}>
                                                    <View style={styles.col50}>
                                                        <Text style={styles.label}>Origin</Text>
                                                        <Text
                                                            style={styles.value}>{item.item?.["origin.name"]}</Text>
                                                    </View>
                                                    <View style={styles.col50}>
                                                        <Text style={styles.label}>Destination</Text>
                                                        <Text
                                                            style={styles.value}>{item.item?.["destination.name"]}</Text>
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
                                {/*<Text style={styles.name}>{vm.name}</Text>*/}

                                {/*<FlatList
                                    data={this.state.putAway?.putawayItems}
                                    renderItem={(item: ListRenderItemInfo<PicklistItem>) => (
                                        <PutAwayItem
                                            item={item.item}
                                            onItemTapped={() => this.goToPutawayItemDetailScreen(this.state.putAway, item.item)}

                                        />
                                    )}
                                    // renderItem={(item: ListRenderItemInfo<PutAwayItems>) => renderPutAwayItem(item.item, () => this.onItemTapped(this.props.order, item.item))}
                                    // renderItem={this.renderItem}
                                    keyExtractor={item => item.id}
                                    style={styles.list}
                                />*/}
                            </View>
                        )
                        : null
                }
            </View>
        )
    }

}

function renderPutAway(putAway: PutAway): ReactElement {
    return (
        <TouchableOpacity
            style={styles.listItemContainer}>
            <View style={styles.row}>
                <View style={styles.col50}>
                    <Text style={styles.label}>PutAway Number</Text>
                    <Text style={styles.value}>{putAway?.putawayNumber}</Text>
                </View>
                <View style={styles.col50}>
                    <Text style={styles.label}>Status</Text>
                    <Text style={styles.value}>{putAway?.putawayStatus}</Text>
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
}

const mapStateToProps = (state: RootState) => ({
    putAway: state.putawayReducer.putAway,
});

const mapDispatchToProps: DispatchProps = {
    showScreenLoading,
    hideScreenLoading,
    getOrdersAction,
    fetchPutAwayFromOrderAction
}
export default connect(mapStateToProps, mapDispatchToProps)(PutawayList);
