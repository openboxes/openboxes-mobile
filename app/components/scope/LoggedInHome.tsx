import React from "react";
import {StyleSheet, View} from "react-native";
import {AppState} from "../../redux/Reducer";
import {connect} from "react-redux";
import Dashboard from "../screens/Dashboard";
import Products from "../screens/Products";

export interface OwnProps {
  //no-op
}

interface StateProps {

}

interface DispatchProps {

}

type Props = OwnProps & StateProps & DispatchProps

enum ScreenInFocus {
  Dashboard,
  Products
}

interface State {
  screenInFocus: ScreenInFocus
}

class LoggedInHome extends React.Component<Props, State> {

  constructor(props: Props) {
    super(props);
    this.state = {
      screenInFocus: ScreenInFocus.Dashboard
    }
    this.goToProductsPage = this.goToProductsPage.bind(this)
    this.goToDashboardsPage = this.goToDashboardsPage.bind(this)
  }

  goToProductsPage() {
    this.setState({
      screenInFocus: ScreenInFocus.Products
    })
  }

  goToDashboardsPage() {
    this.setState({
      screenInFocus: ScreenInFocus.Dashboard
    })
  }

  render() {
    let content
    switch (this.state.screenInFocus) {
      case ScreenInFocus.Dashboard:
        content =
          <Dashboard onProductsCardPressed={this.goToProductsPage}/>
        break;
      case ScreenInFocus.Products:
        content =
          <Products exit={this.goToDashboardsPage}/>
        break;
    }
    return (
      <View style={styles.container}>
        {content}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "column",
    flex: 1
  }
})

const mapStateToProps = (state: AppState): StateProps => ({})

const mapDispatchToProps: DispatchProps = {};

export default connect<StateProps, DispatchProps, OwnProps, AppState>(mapStateToProps, mapDispatchToProps)(LoggedInHome);
