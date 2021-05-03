import React from "react";
import {StyleSheet, Text, View } from "react-native";
import Header from "../Header";
import {AppState} from "../../redux/Reducer";
import {connect} from "react-redux";
import Icon, {Name} from "../Icon";
import Theme from "../../utils/Theme";

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

class Dashboard extends React.Component<Props, State> {

  render() {
    let countItems = [
      {
        icon: Name.Boxes,
        label: "Products"
      }
    ]
    return (
      <View style={styles.screenContainer}>
        <Header title="Dashboard"/>
        {
          countItems.map(item => {
            return <View style={styles.countContainer} key={item.label}>
              <View style={styles.countLabelAndIconContainer}>
                <Icon name={item.icon} size={14}/>
                <Text style={styles.countLabel}>{item.label}</Text>
              </View>
            </View>
          })
        }
      </View>
    );
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
