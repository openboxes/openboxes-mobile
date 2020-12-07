import React from "react";
import { ActivityIndicator, View } from "react-native";
import { ExpoScanner } from "../components/ExpoScanner";

class Scanner extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isFocused: false,
    };
  }

  componentDidMount() {
    // this.focusListner = this.props.navigation.addListener("didFocus", () =>
    //   this.setState({ isFocused: true })
    // );
    // this.blurListner = this.props.navigation.addListener("willBlur", () =>
    //   this.setState({ isFocused: false })
    // );
  }
  componentWillUnmount() {
    // this.focusListner.remove();
    // this.blurListner.remove();
  }

  render() {
    return <ExpoScanner />;
  }
}

const styles = {
  container: {
    flexGrow: 1,
  },
  spinner: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
};

export default Scanner;
