import {DispatchProps, PicklistOwnProps, Props} from "./OrderDetailsProps"
import {NavigationStatePickItemDetails, State} from "./State";
import React, {ReactElement} from "react";
import {AppState} from "../../../redux/Reducer";
import {
  dispatchHideProgressBarAction as hideProgressBar,
  dispatchShowProgressBarAction as showProgressBar
} from "../../../redux/Dispatchers";
import {OwnProps, StateProps} from "../product_details/Props";
import {connect} from "react-redux";
import {orderDetailsVMMapper} from "./OrderDetailsVMMapper";
import ScreenContainer from "../../ScreenContainer";
import Header from "../../Header";
import {FlatList, ListRenderItemInfo, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import Theme from "../../../utils/Theme";
import PickList from "../../../data/picklist/PickList";
import {getPickListItemsApi} from "../../../data/picklist/GetPickList"
import getProductsFromApi from "../../../data/product/GetProducts";
import Item from "../../../data/picklist/Item";
import Product from "../../../data/product/Product";
import Order from "../../../data/order/Order";
import PickOrderItem from "../picklist/PickOrderItem";
import {NavigationStateHere, NavigationStateOrderDetails, NavigationStateType} from "../orders/State";
import PicklistItem from "../../../data/picklist/PicklistItem";
import showPopup from "../../Popup";

class OrderDetails extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      pickList: null,
      error: null,
      pickListItems: [],
      navigationState: new NavigationStateHere(),
    }
    this.getPickListItems = this.getPickListItems.bind(this)
    this.renderPickOrderItemScreen = this.renderPickOrderItemScreen.bind(this)
    this.showOrderDetailsScreen = this.showOrderDetailsScreen.bind(this)
  }

  componentDidMount() {
    (async () => {
      console.debug("this.props.order.id::" + this.props.order.picklist)
      if(this.props.order.picklist!=null) {
        const items = await this.getPickListItems(this.props.order.picklist ? this.props.order.picklist.id : '')
        // if (!pickList) {
        //   this.setState({
        //     error: "No Picklist found",
        //     pickList: pickList
        //   })
        //   // this.props.exit()
        //   // return
        // }

        if (items?.length == 0) {
          this.setState({
            pickList: null,
            error: "No Picklist found",
            pickListItems: items
          })
        } else {
          this.setState({
            pickList: null,
            error: null,
            pickListItems: items ? items : []
          })
        }
      }else{
        await showPopup({
          message: "PickList is empty",
          positiveButtonText: "Ok"
        })
      }
    })()
  }

  // @ts-ignore
  async getPickListItems(id: string): Promise<PicklistItem[] | null> {
    try {
      return await getPickListItemsApi(id)
    } catch (e) {

    }
  }


  render() {
    const vm = orderDetailsVMMapper(this.props, this.state)
    switch (this.state.navigationState.type) {
      case NavigationStateType.Here:
        return (<ScreenContainer>
          <Header
            title={vm.header}
            backButtonVisible={true}
            onBackButtonPress={this.props.exit}
          />
          <View style={styles.contentContainer}>
            {/*<Text style={styles.name}>{vm.name}</Text>*/}
            <View style={styles.row}>
              <View style={styles.col50}>
                <Text style={styles.label}>Order Number</Text>
                <Text style={styles.value}>{vm.id}</Text>
              </View>
              <View style={styles.col50}>
                <Text style={styles.label}>Name</Text>
                <Text style={styles.value}>{vm.name}</Text>
              </View>
            </View>
            <View style={styles.row}>
              <View style={styles.col50}>
                <Text style={styles.label}>Status</Text>
                <Text style={styles.value}>{vm.status}</Text>
              </View>
              <View style={styles.col50}>
                <Text style={styles.label}>Origin</Text>
                <Text style={styles.value}>{vm.origin.locationNumber}-{vm.origin.name}</Text>
              </View>
            </View>
            <View style={styles.row}>
              <View style={styles.col50}>
                <Text style={styles.label}>Destination</Text>
                <Text style={styles.value}>{vm.destination.locationNumber}-{vm.destination.name}</Text>
              </View>
            </View>
            <FlatList
              data={this.state.pickListItems}
              renderItem={(item: ListRenderItemInfo<PicklistItem>) => renderPickListItem(item.item, () => this.onItemTapped(this.props.order, item.item))}
              keyExtractor={item => item.id}
              style={styles.list}
            />
          </View>
        </ScreenContainer>);
      case NavigationStateType.OrderDetails:
        const navigationStatePickItemDetails = this.state.navigationState as NavigationStatePickItemDetails
        return this.renderPickOrderItemScreen(navigationStatePickItemDetails.order, navigationStatePickItemDetails.item);
    }
  }

  renderPickOrderItemScreen(order: Order, item: PicklistItem) {
    return (
      <PickOrderItem
        order={order}
        pickListItem={item}
        exit={this.showOrderDetailsScreen}
      />
    )
  }

  showOrderDetailsScreen() {
    this.setState({
      navigationState: new NavigationStateHere()
    })
  }

  onItemTapped(order: Order, item: PicklistItem){
    this.setState({
      navigationState: new NavigationStatePickItemDetails(order, item)
    })
  }
}

function renderPickListItem(
  item: PicklistItem,
  onItemTapped: () => void

): ReactElement {
  return (
    <TouchableOpacity
      style={styles.listItemContainer}
      onPress={() => onItemTapped()}
    >
      <View style={styles.row}>
        <View style={styles.col50}>
          <Text style={styles.label}>Product Code</Text>
          <Text style={styles.value}>{item.productCode}</Text>
        </View>
        <View style={styles.col50}>
          <Text style={styles.label}>Product Name</Text>
          <Text style={styles.value}>{item["product.name"]}</Text>
        </View>
      </View>
      <View style={styles.row}>
        <View style={styles.col50}>
          <Text style={styles.label}>Lot</Text>
          <Text style={styles.value}>{item.lotNumber}</Text>
        </View>
        <View style={styles.col50}>
          <Text style={styles.label}>Expiry</Text>
          <Text style={styles.value}>{item.expirationDate}</Text>
        </View>
      </View>
      <View style={styles.row}>
        <View style={styles.col50}>
          <Text style={styles.label}>Qty Required</Text>
          <Text style={styles.value}>{item.quantityRequested}</Text>
        </View>
        <View style={styles.col50}>
          <Text style={styles.label}>Qty Picked</Text>
          <Text style={styles.value}>{item.quantityPicked}</Text>
        </View>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  contentContainer: {
    display: "flex",
    flex: 1,
    flexDirection: "column",
    padding: 8
  },
  listItemContainer: {
    display: "flex",
    flexDirection: "column",
    flex: 1,
    borderRadius: Theme.roundness,
    borderColor: Theme.colors.backdrop,
    borderWidth: 1,
    margin: 4,
    padding: 4,
    justifyContent: "center"
  },
  name: {
    fontSize: 17,
    color: Theme.colors.text,
    fontWeight: "bold"
  },
  boxHeading: {
    fontSize: 15,
    color: Theme.colors.text,
    fontWeight: "bold",
    marginTop: 8
  },
  box: {
    borderColor: Theme.colors.onBackground,
    borderWidth: 1,
    borderRadius: 8,
    marginTop: 8,
    padding: 8
  },
  descriptionLabel: {
    fontSize: 20,
    color: Theme.colors.text,
    fontWeight: "bold",
    marginTop: 8
  },
  descriptionText: {
    fontSize: 16,
    color: Theme.colors.text,
    borderColor: Theme.colors.onBackground,
    borderWidth: 1,
    borderRadius: 8,
    marginTop: 8,
    padding: 8
  },
  detailsLabel: {
    fontSize: 20,
    color: Theme.colors.text,
    fontWeight: "bold",
    marginTop: 8
  },
  detailsContainer: {
    padding: 8,
    borderColor: Theme.colors.onBackground,
    borderWidth: 1,
    borderRadius: 8,
    marginTop: 8
  },
  detailsItemContainer: {
    display: "flex",
    flexDirection: "row",
    flex: 0
  },
  detailsItemName: {
    fontSize: 16,
    color: Theme.colors.text,
    fontWeight: "bold"
  },
  detailsItemValue: {
    fontSize: 16,
    color: Theme.colors.text,
    marginStart: 8
  },
  container: {
    flexWrap: 'wrap',
    alignItems: 'flex-start', // if you want to fill rows left to right
    borderColor: Theme.colors.onBackground,
    borderWidth: 1,
    borderRadius: 8,
  },
  textAlign: {
    textAlign: "right"
  },
  tinyLogo: {
    width: '100%',
    height: '20%',
  },
  logo: {
    width: 66,
    height: 58,
  },
  content: {
    display: "flex",
    flexDirection: "column",
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  list: {
    width: "100%"
  },
  listItemNameContainer: {
    display: "flex",
    flexDirection: "column",
    flex: 0,
    marginStart: 4,
    width: "50%"
  },
  listItemCategoryContainer: {
    display: "flex",
    flexDirection: "column",
    flex: 0,
    marginStart: 4,
    marginTop: 4
  },
  listItemCategoryLabel: {
    fontSize: 12,
    color: Theme.colors.placeholder
  },
  listItemCategory: {
    fontSize: 16,
    color: Theme.colors.text
  },
  row: {
    flexDirection: 'row',
    borderColor: Theme.colors.onBackground,
    // borderBottomWidth: 1,
    marginTop: 1,
    padding: 2,
    width: '100%'
  },
  col50: {
    display: "flex",
    flexDirection: "column",
    flex: 0,
    marginStart: 4,
    width: "50%"

  },
  label: {
    fontSize: 12,
    color: Theme.colors.placeholder
  },
  value: {
    fontSize: 16,
    color: Theme.colors.text
  }
})


const mapDispatchToProps: DispatchProps = {
  showProgressBar,
  hideProgressBar
}

const mapStateToProps = (state: AppState): StateProps => ({})
export default connect<StateProps, DispatchProps, PicklistOwnProps, AppState>(mapStateToProps, mapDispatchToProps)(OrderDetails)

