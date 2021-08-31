import React from "react";
import {StyleSheet, Text, TouchableOpacity, View} from "react-native";
import Header from "../../Header";
import {AppState} from "../../../redux/Reducer";
import {connect} from "react-redux";
import Icon, {Name} from "../../Icon";
import Theme from "../../../utils/Theme";
import Products from "../products/Products";
import {DispatchProps, OwnProps, Props, StateProps} from "./Props";
import {NavigationState, State} from "./State";
import ScreenContainer from "../../ScreenContainer";
import QuickBarCodeScanner from "../QuickBarCodeScanner";

class Dashboard extends React.Component<Props, State> {

  constructor(props: Props) {
    super(props);
    this.state = {
      navigationState: NavigationState.Here
    }
    this.renderContent = this.renderContent.bind(this)
    this.goToProductsScreen = this.goToProductsScreen.bind(this)
    this.goToQuickBarCodeScannerScreen = this.goToQuickBarCodeScannerScreen.bind(this)
    this.renderProductsScreen = this.renderProductsScreen.bind(this)
    this.renderQuickBarCodeScanScreen = this.renderQuickBarCodeScanScreen.bind(this)
    this.showDashboardContent = this.showDashboardContent.bind(this)
  }

  render() {
    switch (this.state.navigationState) {
      case NavigationState.Here:
        return this.renderContent()
      case NavigationState.ProductsScreen:
        return this.renderProductsScreen()
      case NavigationState.QuickBarCodeScannerScreen:
        return this.renderQuickBarCodeScanScreen()
    }
  }

  renderContent() {
    return (
      <ScreenContainer>
        <Header
          title="Dashboard"
          backButtonVisible={false}
        />
        <TouchableOpacity
          style={styles.countContainer}
          onPress={this.goToProductsScreen}
        >
          <View style={styles.countLabelAndIconContainer}>
            <Icon name={Name.Boxes} size={14}/>
            <Text style={styles.countLabel}>Products</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.countContainer}
          onPress={this.goToQuickBarCodeScannerScreen}
        >
          <View style={styles.countLabelAndIconContainer}>
            <Icon name="barCode" size={14}/>
            <Text style={styles.countLabel}>Bar Code</Text>
          </View>
        </TouchableOpacity>
      </ScreenContainer>
    )
  }

  goToProductsScreen() {
    this.setState({
      navigationState: NavigationState.ProductsScreen
    })
  }
  goToQuickBarCodeScannerScreen() {
    this.setState({
      navigationState: NavigationState.QuickBarCodeScannerScreen
    })
  }

  renderProductsScreen() {
    return (<Products exit={this.showDashboardContent}/>)
  }

  renderQuickBarCodeScanScreen() {
    return (<QuickBarCodeScanner exit={this.showDashboardContent}/>)
  }

  showDashboardContent() {
    this.setState({
      navigationState: NavigationState.Here
    })
  }
}

const styles = StyleSheet.create({
  screenContainer: {
    display: "flex",
    flexDirection: "column",
    flex: 1
  },
  countContainer: {
    display: "flex",
    flexDirection: "column",
    flex: 0,
    borderColor: Theme.colors.backdrop,
    borderWidth: 1,
    margin: 4,
    borderRadius: 4,
    padding: 8
  },
  countLabelAndIconContainer: {
    display: "flex",
    flexDirection: "row",
    flex: 0,
    alignItems: "center"
  },
  countLabel: {
    fontWeight: "bold",
    fontSize: 16,
    marginStart: 4
  }
});

const mapStateToProps = (state: AppState): StateProps => ({
  //no-op
})

const mapDispatchToProps: DispatchProps = {
  //no-op
}

export default connect<StateProps, DispatchProps, OwnProps, AppState>(mapStateToProps, mapDispatchToProps)(Dashboard);
