import React from "react";
import {StyleSheet, Text, TouchableOpacity, View} from "react-native";
import Header from "../Header";
import {AppState} from "../../redux/Reducer";
import {connect} from "react-redux";
import Icon, {Name} from "../Icon";
import Theme from "../../utils/Theme";
import Products from "./products/Products";

export interface OwnProps {

}

interface StateProps {
  //no-op
}

interface DispatchProps {
  //no-op
}

type Props = OwnProps & StateProps & DispatchProps;

enum NavigationState {
  Here,
  ProductsScreen
}

interface State {
  navigationState: NavigationState
}

class Dashboard extends React.Component<Props, State> {

  constructor(props: Props) {
    super(props);
    this.state = {
      navigationState: NavigationState.Here
    }
    this.renderContent = this.renderContent.bind(this)
    this.goToProductsScreen = this.goToProductsScreen.bind(this)
    this.renderProductsScreen = this.renderProductsScreen.bind(this)
    this.showDashboardContent = this.showDashboardContent.bind(this)
  }

  render() {
    switch (this.state.navigationState) {
      case NavigationState.Here:
        return this.renderContent()
      case NavigationState.ProductsScreen:
        return this.renderProductsScreen()
    }
  }

  renderContent() {
    return (
      <View style={styles.screenContainer}>
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
      </View>
    )
  }

  goToProductsScreen() {
    this.setState({
      navigationState: NavigationState.ProductsScreen
    })
  }

  renderProductsScreen() {
    return (<Products exit={this.showDashboardContent}/>)
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
