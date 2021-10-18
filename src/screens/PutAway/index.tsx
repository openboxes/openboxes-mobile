// import {DispatchProps, OwnProps, Props, StateProps} from "./types";
// import {NavigationStateHere, NavigationStatePutAwayDetail, NavigationStateType, State} from "../PutAwayDetail/State";
// import React from "react";
// // import Order from "../../../data/order/Order";
// import {getOrdersAction} from '../../redux/actions/orders';
// import {View} from "react-native";
// import BarCodeSearchHeader from '../Products/BarCodeSearchHeader';
//
// import {connect} from "react-redux";
// import {showScreenLoading, hideScreenLoading} from '../../redux/actions/main';
// import {Order} from "../../data/order/Order";
// import {RootState} from "../../redux/reducers";
// import showPopup from "../../components/Popup";
// import styles from "./styles";
//
// class PutAwayList extends React.Component<Props, State> {
//   constructor(props: Props) {
//     super(props)
//     this.state = {
//       error: null,
//       putAwayList: null,
//       putAway: null,
//       orderId: null,
//       navigationState: new NavigationStateHere()
//     }
//
//   }
//
//    searchOrder =(query: string)=> {
//     const actionCallback = (data: any) => {
//       if (data?.error) {
//         showPopup({
//           title: data.error.message ? 'Failed to fetch products' : null,
//           message: data.error.message ?? 'Failed to fetch products',
//           positiveButton: {
//             text: 'Retry',
//             callback: () => {
//               this.props.getOrdersAction(actionCallback);
//             },
//           },
//           negativeButtonText: 'Cancel',
//         });
//       } else {
//         if (data.length == 0) {
//           this.setState({
//             error: "No orders found",
//           })
//         } else if (data.length == 1) {
//           this.showPutAwayDetailsScreen(data[0])
//         } else {
//           console.debug("orders found::" + data.length)
//           this.setState({
//             error: null,
//           })
//           //this.showPutAwayDetailsScreen(orders[0])
//         }
//       }
//       this.props.hideScreenLoading();
//     };
//     this.props.getOrdersAction(actionCallback);
//   }
//
//   showPutAwayListScreen =()=> {
//     console.debug(">>>>> showPutAwayListScreen")
//     this.setState({
//       navigationState: new NavigationStateHere()
//     })
//   }
//
//   showPutAwayDetailsScreen =(order: Order)=> {
//     this.props.navigation.navigate('PutAwayDetails', {orderId: order.id})
//   }
//
//   render() {
//     return (
//       <View style={styles.screenContainer}>
//         {/*<Header*/}
//         {/*  title="PutAway List"*/}
//         {/*  subtitle={'All Pending Put Away List'}*/}
//         {/*  backButtonVisible={true}*/}
//         {/*  onBackButtonPress={this.onBackButtonPress}*/}
//         {/*/>*/}
//         <BarCodeSearchHeader
//           onBarCodeSearchQuerySubmitted={this.searchOrder}
//           placeHolder={'Search Orders by Name'}
//           searchBox={false}/>
//       </View>
//       )
//   }
//
// }
//
//
// const mapStateToProps = (state: RootState) => ({
//   products: state.productsReducer,
// });
//
// const mapDispatchToProps: DispatchProps = {
//   showScreenLoading,
//   hideScreenLoading,
//   getOrdersAction
// }
// export default connect(mapStateToProps, mapDispatchToProps)(PutAwayList);
