import React from "react";
import {StyleSheet, View} from "react-native";
import {AppState} from "../../redux/Reducer";
import {connect} from "react-redux";
import SearchHeader from "../SearchHeader";

export interface OwnProps {
  //no-op
}

interface StateProps {
  //no-op
}

interface DispatchProps {
  //no-op
}

type Props = OwnProps & StateProps & DispatchProps;

interface State {

}

class Products extends React.Component<Props, State> {

  constructor(props: Props) {
    super(props);
    this.onBackButtonPress = this.onBackButtonPress.bind(this)
    this.onSearchQueryChange = this.onSearchQueryChange.bind(this)
  }

  onBackButtonPress() {
    console.log("onBackButtonPress")
  }

  onSearchQueryChange(query: string) {
    console.log(`onSearchQueryChange, query = ${query}`)
  }

  render() {
    return (
      <View style={styles.screenContainer}>
        <SearchHeader
          title="Products"
          backButtonVisible={true}
          onBackButtonPress={this.onBackButtonPress}
          searchHint="Search products"
          onSearchQueryChange={this.onSearchQueryChange}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  screenContainer: {
    display: "flex",
    flexDirection: "column",
    flex: 1
  }
});


const mapStateToProps = (state: AppState): StateProps => ({
  //no-op
})

const mapDispatchToProps: DispatchProps = {
  //no-op
}

export default connect<StateProps, DispatchProps, OwnProps, AppState>(mapStateToProps, mapDispatchToProps)(Products);
