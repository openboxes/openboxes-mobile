import React from "react";
import {ActivityIndicator, View, Modal, StyleSheet} from "react-native";
import Theme from "../constants/Theme";

export default class ProgressDialog extends React.Component {

  render() {
    return (
      <View style={styles.modalParent}>
        <Modal
          visible={this.props.visible}
          transparent
        >
          <View style={styles.modalChild}>
            <View style={styles.progressContainer}>
              <ActivityIndicator color={Theme.COLORS.PRIMARY} size="large"/>
            </View>
          </View>
        </Modal>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  modalParent: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0
  },
  modalChild: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#00000099"
  },
  progressContainer: {
    flex: 0,
    backgroundColor: "#FFFFFF",
    shadowColor: "#000000",
    padding: 20,
    borderRadius: 5
  }
});
