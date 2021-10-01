import React from "react";
import {PickListProps, Props} from "./PickListProps";
import {State} from "./State";
import {orderDetailsVMMapper} from "../order_details/OrderDetailsVMMapper";
import ScreenContainer from "../../ScreenContainer";
import Header from "../../Header";
import {FlatList, ListRenderItemInfo, StyleSheet, Text, TextInput, TouchableOpacity, View} from "react-native";
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

class PickOrderItem extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      error: null,
      pickListItem: null,
      order: null
    }
  }

  render() {
    const vm = pickListVMMapper(this.props, this.state)
    return (
      <ScreenContainer>
        <Header
          title={vm.header}
          backButtonVisible={true}
          onBackButtonPress={this.props.exit}
        />
        <View style={styles.contentContainer}>
          <Text style={styles.name}>{vm.picklistItems.product.name}</Text>
          <View style={styles.row}>
            <View style={styles.col50}>
              <Text style={styles.label}>Product Code</Text>
              <Text style={styles.value}>{vm.picklistItems.productCode}</Text>
            </View>
            <View style={styles.col50}>
              <Text style={styles.label}>Product Name</Text>
              <Text style={styles.value}>{vm.picklistItems.product.name}</Text>
            </View>
          </View>
          <View style={styles.row}>
          </View>
          <View style={styles.row}>
            <View style={styles.col50}>
              <Text style={styles.label}>Qty Required</Text>
              <TextInput style={styles.textInput} placeholder="Qty Required"
                         value={vm.picklistItems.quantityRequired.toString()}/>
              {/*<Text style={styles.value}>{vm.picklistItems.quantityRequired}</Text>*/}
            </View>
            <View style={styles.col50}>
              <Text style={styles.label}>Qty Picked</Text>
              <TextInput style={styles.textInput} placeholder="Qty Picked"
                         value={vm.picklistItems.quantityPicked.toString()}/>
              {/*<Text style={styles.value}>{vm.picklistItems.quantityPicked}</Text>*/}
            </View>
          </View>

        </View>
      </ScreenContainer>
    )
  }
}

const styles = StyleSheet.create({
  contentContainer: {
    display: "flex",
    flex: 1,
    flexDirection: "column",
    padding: 8
  },
  name: {
    fontSize: 17,
    color: Theme.colors.text,
    fontWeight: "bold"
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
