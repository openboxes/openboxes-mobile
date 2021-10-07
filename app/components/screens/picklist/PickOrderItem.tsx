import React from "react";
import {PickListProps, Props} from "./PickListProps";
import {State} from "./State";
import {orderDetailsVMMapper} from "../order_details/OrderDetailsVMMapper";
import ScreenContainer from "../../ScreenContainer";
import Header from "../../Header";
import {
  FlatList,
  KeyboardAvoidingView,
  ListRenderItemInfo, ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import Item from "../../../data/picklist/Item";
import {pickListVMMapper} from "./PickListVMMapper";
import Theme from "../../../utils/Theme";
import {DispatchProps, PicklistOwnProps} from "../order_details/OrderDetailsProps";
import {
  dispatchHideProgressBarAction as hideProgressBar,
  dispatchShowProgressBarAction as showProgressBar
} from "../../../redux/Dispatchers";
import {AppState} from "../../../redux/Reducer";
import {StateProps} from "../product_details/Props";
import {connect} from "react-redux";
import {Searchbar} from "react-native-paper";
import Button from "../../Button";
import Order from "../../../data/order/Order";
import {
  submitPickListItem as submitPickListItem
} from "../../../data/picklist/PickList";
import {
  searchProductsByProductCode as searchProductCodeFromApi,
} from "../../../data/product/SearchProducts"
import {
  searchLocationByLocationNumber as searchLocationByLocationNumber,
} from "../../../data/location/SearchLocation"
import showPopup from "../../Popup";
import {lightBlue50} from "react-native-paper/lib/typescript/styles/colors";
import PicklistItem from "../../../data/picklist/PicklistItem";
import getOrdersFromApi from "../../../data/order/GetOrders";
import {getPickListItemApi} from "../../../data/picklist/GetPickList"


class PickOrderItem extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      error: null,
      pickListItem: null,
      order: null,
      productSearchQuery: "",
      binLocationSearchQuery: "",
      quantityPicked: "0",
      product: null,
      binLocation: null,
    }
    this.getPickListItem = this.getPickListItem.bind(this)
    this.productSearchQueryChange = this.productSearchQueryChange.bind(this)
    this.binLocationSearchQueryChange = this.binLocationSearchQueryChange.bind(this)
    this.quantityPickedChange = this.quantityPickedChange.bind(this)
    this.formSubmit = this.formSubmit.bind(this)
    this.onProductBarCodeSearchQuerySubmitted = this.onProductBarCodeSearchQuerySubmitted.bind(this)
    this.onBinLocationBarCodeSearchQuerySubmitted = this.onBinLocationBarCodeSearchQuerySubmitted.bind(this)

  }

  componentDidMount(){
    this.getPickListItem()
  }

  // @ts-ignore
  async getPickListItem(): Promise<PicklistItem>{
    try {
      // this.props.showProgressBar("Fetching PickList Item")
      return await getPickListItemApi(this.props.pickListItem?.id)
    }catch (e){

    }
    this.props.hideProgressBar()
  }

  async formSubmit() {
    try {
      this.props.showProgressBar("Submitting Pick Item")
      let errorTitle = ""
      let errorMessage = ""
      if (this.state.product == null) {
        errorTitle = "Product Code!"
        errorMessage = "Please scan Product Code."
      } else if (this.state.quantityPicked == null || this.state.quantityPicked == "") {
        errorTitle = "Quantity Pick!"
        errorMessage = "Please pick some quantity."
      }
      if (errorTitle != "") {
        this.props.hideProgressBar()
        await showPopup({
          title: errorTitle,
          message: errorMessage,
          // positiveButtonText: "Retry",
          negativeButtonText: "Cancel"
        })
        return Promise.resolve(null)
      }
      const requestBody = {
        "product.id": this.state.product?.id,
        "productCode": this.state.product?.productCode,
        "inventoryItem.id": null,
        "binLocation.id": this.state.binLocation?.id,
        "binLocation.locationNumber": this.state.binLocation?.locationNumber ? this.state.binLocation?.locationNumber : this.state.binLocationSearchQuery,
        "quantityPicked": this.state.quantityPicked,
        "picker.id": null,
        "datePicked": null,
        "reasonCode": null,
        "comment": null,
        "forceUpdate": false
      }
      return await submitPickListItem(requestBody, this.props.pickListItem?.id)
    } catch (e) {
      const title = e.message ? "Failed submit item" : null
      const message = e.message ?? "Failed submit item"
      const shouldRetry = await showPopup({
        title: title,
        message: message,
        // positiveButtonText: "Retry",
        negativeButtonText: "Cancel"
      })
      return Promise.resolve(null)
    } finally {
      this.props.hideProgressBar()
    }
  }

  productSearchQueryChange(query: string) {
    this.setState({
      productSearchQuery: query
    })
  }

  onProductBarCodeSearchQuerySubmitted() {

    (async () => {
      if (!this.state.productSearchQuery) {
        await showPopup({
          message: "Search query is empty",
          positiveButtonText: "Ok"
        })
        return
      }

      let searchedProducts = await searchProductCodeFromApi(this.state.productSearchQuery)

      if (!searchedProducts || searchedProducts.length == 0) {
        await showPopup({
          message: "Product not found with ProductCode:" + this.state.productSearchQuery,
          positiveButtonText: "Ok"
        })
        return
      } else if (searchedProducts.length == 1) {
        this.setState({
          product: searchedProducts[0],
          quantityPicked: parseInt(this.state.quantityPicked) + 1 + "",
          productSearchQuery: ""
        })
      }
    })()
  }
  onBinLocationBarCodeSearchQuerySubmitted() {

    (async () => {
      if (!this.state.binLocationSearchQuery) {
        await showPopup({
          message: "Search query is empty",
          positiveButtonText: "Ok"
        })
        return
      }

      let location = await searchLocationByLocationNumber(this.state.binLocationSearchQuery)

      if (!location) {
        await showPopup({
          message: "Bin Location not found with LocationNumber:" + this.state.binLocationSearchQuery,
          positiveButtonText: "Ok"
        })
        return
      } else if (location) {
        this.setState({
          binLocation: location,
          binLocationSearchQuery: ""
        })
      }
    })()
  }

  binLocationSearchQueryChange(query: string) {
    this.setState({
      binLocationSearchQuery: query
    })
  }

  quantityPickedChange(query: string) {
    this.setState({
      quantityPicked: query
    })
  }


  render() {
    const vm = pickListVMMapper(this.props, this.state)
    return (
        <ScrollView>

          <ScreenContainer>
            <Header
              title={vm.header}
              backButtonVisible={true}
              onBackButtonPress={this.props.exit}
            />
            <View style={styles.contentContainer}>
              <View style={styles.topRow}>
                <Text style={styles.name}>{vm.picklistItems["product.name"]}</Text>
              </View>
              <View style={styles.row}>
                <View style={styles.col40}>
                  <Text style={styles.value}>Order Number</Text>
                </View>
                <View style={styles.col60}>
                  <Text style={styles.value}>{vm.order.identifier}</Text>
                </View>
              </View>
              <View style={styles.row}>
                <View style={styles.col40}>
                  <Text style={styles.value}>Destination</Text>
                </View>
                <View style={styles.col60}>
                  <Text style={styles.value}>{vm.order.destination?.name}</Text>
                </View>
              </View>
              <View style={styles.row}>
                <View style={styles.col40}>
                  <Text style={styles.value}>Product Code</Text>
                </View>
                <View style={styles.col60}>
                  <Text style={styles.value}>{vm.picklistItems.productCode}</Text>
                </View>
              </View>
              <View style={styles.row}>
                <View style={styles.col40}>
                  <Text style={styles.value}>Product Name</Text>
                </View>
                <View style={styles.col60}>
                  <Text style={styles.value}>{vm.picklistItems["product.name"]}</Text>
                </View>
              </View>
              <View style={styles.row}>
                <View style={styles.col40}>
                  <Text style={styles.value}>Unit of Measure</Text>
                </View>
                <View style={styles.col60}>
                  <Text style={styles.value}>{vm.picklistItems.unitOfMeasure}</Text>
                </View>
              </View>
              <View style={styles.row}>
                <View style={styles.col40}>
                  <Text style={styles.value}>Lot Number</Text>
                </View>
                <View style={styles.col60}>
                  <Text style={styles.value}>{vm.picklistItems.lotNumber}</Text>
                </View>
              </View>
              <View style={styles.row}>
                <View style={styles.col40}>
                  <Text style={styles.value}>Expiration</Text>
                </View>
                <View style={styles.col60}>
                  <Text style={styles.value}>{vm.picklistItems.expirationDate}</Text>
                </View>
              </View>
              <View style={styles.row}>
                <View style={styles.col40}>
                  <Text style={styles.value}>Bin Location</Text>
                </View>
                <View style={styles.col60}>
                  <Text style={styles.value}>{vm.picklistItems["binLocation.name"]}</Text>
                </View>
              </View>
              <View style={styles.row}>
                <View style={styles.col40}>
                  <Text style={styles.value}>Qty Requested</Text>
                </View>
                <View style={styles.col60}>
                  <Text style={styles.value}>{vm.picklistItems.quantityRequested}</Text>
                </View>
              </View>
              <View style={styles.row}>
                <View style={styles.col40}>
                  <Text style={styles.value}>Qty Remaining</Text>
                </View>
                <View style={styles.col60}>
                  <Text
                    style={styles.value}>{vm.picklistItems.quantityToPick}</Text>
                </View>
              </View>
              <View style={styles.row}>
                <View style={styles.col40}>
                  <Text style={styles.value}>Qty Picked</Text>
                </View>
                <View style={styles.col60}>
                  <Text style={styles.value}>{vm.picklistItems.quantityPicked}</Text>
                </View>
              </View>


              <View style={styles.emptyRow}>

              </View>


              <View style={styles.topRow}>
                <View style={styles.col40}>
                  <Text style={styles.value}>Bin Location</Text>
                </View>
                <View style={styles.col60}>
                  <TextInput
                    placeholder="Scan Bin Location"
                    onChangeText={this.binLocationSearchQueryChange}
                    value={this.state.binLocationSearchQuery}
                    style={styles.value}
                    onSubmitEditing={this.onBinLocationBarCodeSearchQuerySubmitted}
                  />
                  {this.state.binLocation != null ? <Text style={styles.info}>{this.state.binLocation?.locationNumber}-{this.state.binLocation?.name}</Text>: null }
                </View>
                <View style={styles.width100}>
                </View>
              </View>
              <View style={styles.row}>
                <View style={styles.col40}>
                  <Text style={styles.value}>Product Code</Text>
                </View>
                <View style={styles.col60}>
                  <TextInput
                    placeholder="Scan Product"
                    onChangeText={this.productSearchQueryChange}
                    value={this.state.productSearchQuery}
                    style={styles.value}
                    onSubmitEditing={this.onProductBarCodeSearchQuerySubmitted}
                  />
                  {this.state.product != null ? <Text style={styles.info}>{this.state.product?.productCode}-{this.state.product?.description}</Text>: null }
                </View>
              </View>
              <View style={styles.row}>
                <View style={styles.col40}>
                  <Text style={styles.value}>Quantity Picked</Text>
                </View>
                <View style={styles.col60}>
                  <TextInput
                    placeholder="Enter Picked Quantity"
                    onChangeText={this.quantityPickedChange}
                    value={this.state.quantityPicked}
                    style={styles.value}
                    // onSubmitEditing={this.onBarCodeSearchQuerySubmitted}
                  />
                </View>
              </View>
              <View>
                <Button
                  title="Submit"
                  style={{
                    marginTop: 8,
                  }}
                  onPress={this.formSubmit}
                />
              </View>
              {/*<View style={styles.row}>
            <View style={styles.col50}>
              <Text style={styles.label}>Qty Available</Text>
              <Text style={styles.value}>{vm.picklistItems.quantityAvailable}</Text>
            </View>
            <View style={styles.col50}>
              <Text style={styles.label}>Qty Picked</Text>
              <TextInput style={styles.textInput} placeholder="Qty Picked"
                         value={vm.picklistItems.quantityPicked.toString()}/>
            </View>
          </View>*/}
            </View>

          </ScreenContainer>
        </ScrollView>
    )
  }
}

const styles = StyleSheet.create({

  contentContainer: {
    display: "flex",
    flex: 1,
    flexDirection: "column",
    padding: 8,
  },
  name: {
    fontSize: 17,
    color: Theme.colors.text,
    fontWeight: "bold",
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    flex: 0,
    marginStart: 4,

  },
  emptyRow: {
    flexDirection: 'row',
    borderColor: Theme.colors.onBackground,
    // borderBottomWidth: 1,
    // marginTop: 1,
    // padding: 2,
    width: '100%',
    height: 20,
  },
  topRow: {
    flexDirection: 'row',
    borderColor: Theme.colors.onBackground,
    // borderBottomWidth: 1,
    // marginTop: 1,
    // padding: 2,
    width: '100%',
    borderLeftWidth: 1,
    borderTopWidth: 1,
    borderTopColor: "black",
    borderBottomWidth: 1,
    borderBottomColor: "black",
    borderRightWidth: 1,
    borderRightColor: "black",
    textAlign: "center"

  },
  row: {
    flexDirection: 'row',
    borderColor: Theme.colors.onBackground,
    // borderBottomWidth: 1,
    // marginTop: 1,
    // padding: 2,
    width: '100%',
    borderLeftWidth: 1,
    borderLeftColor: "black",
    borderBottomWidth: 1,
    borderBottomColor: "black",
    borderRightWidth: 1,
    borderRightColor: "black"
  },
  col30: {
    display: "flex",
    flexDirection: "column",
    flex: 0,
    marginStart: 4,
    width: "30%",
    borderRightWidth: 1,
    borderRightColor: "black"

  },
  col40: {
    display: "flex",
    flexDirection: "column",
    flex: 0,
    marginStart: 4,
    width: "40%",
    borderRightWidth: 1,
    borderRightColor: "black",
    justifyContent: 'center', //Centered horizontally
    // alignItems: 'center', //Centered vertically

  },
  col50: {
    display: "flex",
    flexDirection: "column",
    flex: 0,
    marginStart: 4,
    width: "50%",
    borderRightWidth: 1,
    borderRightColor: "black"

  },
  col60: {
    display: "flex",
    flexDirection: "column",
    flex: 0,
    marginStart: 4,
    width: "60%",
    // borderRightWidth:1,
    // borderRightColor:"black"

  },
  col70: {
    display: "flex",
    flexDirection: "column",
    flex: 0,
    marginStart: 4,
    width: "70%"

  },
  col100: {
    display: "flex",
    flexDirection: "column",
    flex: 0,
    marginStart: 4,
    width: "100%"
  },
  width100:{
    width: "100%"
  },
  label: {
    fontSize: 12,
    color: Theme.colors.placeholder,
    width: "30%"

  },
  value: {
    fontSize: 16,
    color: Theme.colors.text,
    // justifyContent: 'center'
    // width: "70%"
  },
  info: {
    fontSize: 12,
    color: "#000000",
    // justifyContent: 'center'
    // width: "70%"
  },
  textInput: {
    fontSize: 16,
    color: Theme.colors.text,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: "#e7edd8"
  }
})

const mapDispatchToProps: DispatchProps = {
  showProgressBar,
  hideProgressBar
}
const mapStateToProps = (state: AppState): StateProps => ({})
export default connect<StateProps, DispatchProps, PickListProps, AppState>(mapStateToProps, mapDispatchToProps)(PickOrderItem)
