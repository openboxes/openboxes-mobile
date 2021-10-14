import React, {ReactElement} from "react";
import {DispatchProps, OwnProps, Props, StateProps} from "./Props";
import {NavigationStateHere, NavigationStatePutAwayDetail, NavigationStateType, State} from "./State";
import {connect} from "react-redux";
import {AppState} from "../../../redux/Reducer";
import {
  dispatchHideProgressBarAction as hideProgressBar,
  dispatchShowProgressBarAction as showProgressBar
} from "../../../redux/Dispatchers";
import ScreenContainer from "../../ScreenContainer";
import Header from "../../Header";
import {FlatList, ListRenderItemInfo, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import PicklistItem from "../../../data/picklist/PicklistItem";
import Theme from "../../../utils/Theme";
import * as vm from "vm";
import PutAwayItems from "../../../app/data/putaway/PutAwayItems";
import {fetchPutAwayFromOrder} from "../../redux/actions/PutAwayApi";

class PutAwayDetail extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      error: null,
      putAwayList: null,
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
      this.props.showProgressBar("Fetching PutAway Detail")
      console.debug("this.props.orderId::"+this.props.orderId)
      putAwayObj = await fetchPutAwayFromOrder(this.props.orderId)
      this.setState({
        putAway: putAwayObj
      })
    } catch (e) {
      const title = e.message ? "Failed to fetch PutAway Detail" : null
      const message = e.message ?? "Failed to fetch PutAway Detail"
      return Promise.resolve(null)
    } finally {
      this.props.hideProgressBar()
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
    return (<ScreenContainer>
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
    </ScreenContainer>);
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

const mapStateToProps = (state: AppState): StateProps => ({
  //no-op
})

const mapDispatchToProps: DispatchProps = {
  showProgressBar,
  hideProgressBar
}

export default connect<StateProps, DispatchProps, OwnProps, AppState>(mapStateToProps, mapDispatchToProps)(PutAwayDetail)
