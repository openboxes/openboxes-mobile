import {DispatchProps, OwnProps, Props, StateProps} from "./Props";
//import {NavigationStateHere, NavigationStatePutawayDetails, NavigationStateType, State} from "./State";
import React from "react";
// import Order from "../../../data/order/Order";
import {getOrdersAction} from '../../redux/actions/orders';
import {StyleSheet, View} from "react-native";
import BarCodeSearchHeader from '../Products/BarCodeSearchHeader';

import {connect} from "react-redux";
import {AppState} from "../../../redux/Reducer";
// import {
//   dispatchHideProgressBarAction as hideProgressBar,
//   dispatchShowProgressBarAction as showProgressBar
// } from "../../../redux/Dispatchers";
import PutawayDetails from "../PutawayDetails";
import {Order} from "../../data/order/Order";
import {Header} from "@react-navigation/stack";
import {RootState} from "../../redux/reducers";

class PutawayList extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      error: null,
      putawayList: null,
      putaway: null,
      orderId: null,
      navigationState: new NavigationStateHere()
    }
    this.searchOrder = this.searchOrder.bind(this)
    this.showPutawayListScreen = this.showPutawayListScreen.bind(this)
    this.renderContent = this.renderContent.bind(this)
    this.renderPutawayDetailsScreen = this.renderPutawayDetailsScreen.bind(this)
    this.showPutawayDetailsScreen = this.showPutawayDetailsScreen.bind(this)
    this.onBackButtonPress = this.onBackButtonPress.bind(this)
  }

  async searchOrder(query: string) {
    let orders = null
    try {
      //this.props.showProgressBar("Fetching orders")
      orders = await getOrdersAction(query)
    } catch (e) {
      const title = e.message ? "Failed to fetch orders" : null
      const message = e.message ?? "Failed to fetch orders"
      return Promise.resolve(null)
    } finally {
      //this.props.hideProgressBar()
    }
    if (!orders) {
      this.props.exit()
    }

    if (orders.length == 0) {
      this.setState({
        error: "No orders found",
      })
    } else if (orders.length == 1) {
      this.showPutawayDetailsScreen(orders[0])
    } else {
      console.debug("orders found::" + orders.length)
      this.setState({
        error: null,
      })
      //this.showPutawayDetailsScreen(orders[0])

    }
  }

  showPutawayListScreen() {
    console.debug(">>>>> showPutawayListScreen")
    this.setState({
      navigationState: new NavigationStateHere()
    })
  }

  showPutawayDetailsScreen(order: Order) {
    console.debug(">>>>> showPutawayDetailsScreen")
    this.setState({
      navigationState: new NavigationStatePutawayDetails(order)
    })
  }

  render() {
    // const vm = this.state
    switch (this.state.navigationState.type) {
      case NavigationStateType.Here:
        return this.renderContent();
      case NavigationStateType.PutawayDetails:
        const navigationStatePutawayDetails = this.state.navigationState as NavigationStatePutawayDetails
        return this.renderPutawayDetailsScreen(navigationStatePutawayDetails.order);
    }
  }

  renderPutawayDetailsScreen(order: Order) {
    return (
      <PutawayDetails
        orderId={order.id}
        // pickList={null}
        // pickListItem={[]}
        exit={this.showPutawayListScreen}
      />
    )
  }

  onBackButtonPress() {
    const currState = this.state
    this.props.exit()
  }


  renderContent() {
    return (
      <View style={styles.screenContainer}>
        <Header
          title="Putaway List"
          subtitle={'All Pending Put Away List'}
          backButtonVisible={true}
          onBackButtonPress={this.onBackButtonPress}
        />
        <BarCodeSearchHeader
          onBarCodeSearchQuerySubmitted={this.searchOrder}
          placeHolder={'Search Orders by Name'}
          searchBox={false}/>
      </View>
      )
  }

}
const styles = StyleSheet.create({
  screenContainer: {
    display: "flex",
    flexDirection: "column",
    flex: 1
  },
  content: {
    display: "flex",
    flexDirection: "column",
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  }
});

const mapStateToProps = (state: RootState) => ({
  products: state.productsReducer,
});

const mapDispatchToProps: DispatchProps = {
  //showProgressBar,
  //hideProgressBar
}
export default connect<StateProps, DispatchProps, OwnProps, AppState>(mapStateToProps, mapDispatchToProps)(PutawayList);
