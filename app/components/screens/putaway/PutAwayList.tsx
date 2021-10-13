import {DispatchProps, OwnProps, Props, StateProps} from "./Props";
import {NavigationStateHere, NavigationStatePutAwayDetail, NavigationStateType, State} from "./State";
import React from "react";
import Order from "../../../data/order/Order";
import getOrdersFromApi from "../../../data/order/GetOrders";
import {StyleSheet, View} from "react-native";
import BarCodeSearchHeader from "../products/BarCodeSearchHeader";
import {connect} from "react-redux";
import {AppState} from "../../../redux/Reducer";
import {
  dispatchHideProgressBarAction as hideProgressBar,
  dispatchShowProgressBarAction as showProgressBar
} from "../../../redux/Dispatchers";
import PutAwayDetail from "./PutAwayDetail";
import Header from "../../Header";

class PutAwayList extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      error: null,
      putAwayList: null,
      putAway: null,
      orderId: null,
      navigationState: new NavigationStateHere()
    }
    this.searchOrder = this.searchOrder.bind(this)
    this.showPutAwayListScreen = this.showPutAwayListScreen.bind(this)
    this.renderContent = this.renderContent.bind(this)
    this.renderPutAwayDetailScreen = this.renderPutAwayDetailScreen.bind(this)
    this.showPutAwayDetailsScreen = this.showPutAwayDetailsScreen.bind(this)
    this.onBackButtonPress = this.onBackButtonPress.bind(this)
  }

  async searchOrder(query: string) {
    let orders = null
    try {
      this.props.showProgressBar("Fetching orders")
      orders = await getOrdersFromApi(query)
    } catch (e) {
      const title = e.message ? "Failed to fetch orders" : null
      const message = e.message ?? "Failed to fetch orders"
      return Promise.resolve(null)
    } finally {
      this.props.hideProgressBar()
    }
    if (!orders) {
      this.props.exit()
    }

    if (orders.length == 0) {
      this.setState({
        error: "No orders found",
      })
    } else if (orders.length == 1) {
      this.showPutAwayDetailsScreen(orders[0])
    } else {
      console.debug("orders found::" + orders.length)
      this.setState({
        error: null,
      })
      //this.showPutAwayDetailsScreen(orders[0])

    }
  }

  showPutAwayListScreen() {
    console.debug(">>>>> showPutAwayListScreen")
    this.setState({
      navigationState: new NavigationStateHere()
    })
  }

  showPutAwayDetailsScreen(order: Order) {
    console.debug(">>>>> showPutAwayDetailsScreen")
    this.setState({
      navigationState: new NavigationStatePutAwayDetail(order)
    })
  }

  render() {
    // const vm = this.state
    switch (this.state.navigationState.type) {
      case NavigationStateType.Here:
        return this.renderContent();
      case NavigationStateType.PutAwayDetail:
        const navigationStatePutAwayDetail = this.state.navigationState as NavigationStatePutAwayDetail
        return this.renderPutAwayDetailScreen(navigationStatePutAwayDetail.order);
    }
  }

  renderPutAwayDetailScreen(order: Order) {
    return (
      <PutAwayDetail
        orderId={order.id}
        // pickList={null}
        // pickListItem={[]}
        exit={this.showPutAwayListScreen}
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
          title="PutAway List"
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

const mapStateToProps = (state: AppState): StateProps => ({
  //no-op
})

const mapDispatchToProps: DispatchProps = {
  showProgressBar,
  hideProgressBar
}
export default connect<StateProps, DispatchProps, OwnProps, AppState>(mapStateToProps, mapDispatchToProps)(PutAwayList);
