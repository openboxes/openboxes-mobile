import React from "react";
import {StyleSheet, Text, View} from "react-native";
import {AppState} from "../../../redux/Reducer";
import {
  dispatchHideProgressBarAction as hideProgressBar,
  dispatchShowProgressBarAction as showProgressBar
} from "../../../redux/Dispatchers";
import {connect} from "react-redux";
import ScreenContainer from "../../ScreenContainer";
import Header from "../../Header";
import {DispatchProps, OwnProps, Props, StateProps} from "./Props";
import {State} from "./State";
import {vmMapper} from "./VMMapper";
import Theme from "../../../utils/Theme";

class ProductDetails extends React.Component<Props, State> {

  constructor(props: Props) {
    super(props);
  }

  render() {
    const vm = vmMapper(this.props, this.state)
    return (
      <ScreenContainer>
        <Header
          title={vm.header}
          backButtonVisible={true}
          onBackButtonPress={this.props.exit}
        />
        <View style={styles.contentContainer}>
          <Text style={styles.name}>{vm.name}</Text>
          <Text style={styles.descriptionLabel}>Description</Text>
          <Text style={styles.descriptionText}>{vm.description}</Text>
          <Text style={styles.detailsLabel}>Details</Text>
          <View style={styles.detailsContainer}>
            {
              vm.details.map(item => {
                return (
                  <View key={item.key} style={styles.detailsItemContainer}>
                    <Text style={styles.detailsItemName}>{item.name}</Text>
                    <Text style={styles.detailsItemValue}>{item.value}</Text>
                  </View>
                )
              })
            }
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
    fontSize: 28,
    color: Theme.colors.text,
    fontWeight: "bold"
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
  }
})

const mapStateToProps = (state: AppState): StateProps => ({})

const mapDispatchToProps: DispatchProps = {
  showProgressBar,
  hideProgressBar
}

export default connect<StateProps, DispatchProps, OwnProps, AppState>(mapStateToProps, mapDispatchToProps)(ProductDetails)
