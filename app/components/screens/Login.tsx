import React from "react";
import {StyleSheet, View} from "react-native";
import {connect} from "react-redux";
import showPopup from "../Popup";
import {AppState} from "../../redux/Reducer";
import {login} from "../../data/auth/Login";
import {TextInput} from "react-native-paper";
import Header from "../Header";
import Button from "../Button";

export interface OwnProps {
  //no-op
}

interface StateProps {
  //no-op
}

interface DispatchProps {
  login: (username: string, password: string) => void
}

type Props = OwnProps & StateProps & DispatchProps;

interface State {
  username: string
  password: string
}

class Login extends React.Component<Props, State> {

  constructor(props: Props) {
    super(props);
    this.state = {
      username: "",
      password: ""
    }
    this.onUsernameChange = this.onUsernameChange.bind(this)
    this.onPasswordChange = this.onPasswordChange.bind(this)
    this.onLoginPress = this.onLoginPress.bind(this)
  }

  onUsernameChange(username: string) {
    this.setState({
      username: username
    })
  }

  onPasswordChange(password: string) {
    this.setState({
      password: password
    })
  }

  onLoginPress() {
    (async () => {
      if (!this.state.username) {
        await showPopup({message: "Username not provided"})
        return
      }

      if (!this.state.password) {
        await showPopup({message: "Password not provided"})
        return
      }

      if (this.state.password.length < 6) {
        await showPopup({message: "Password is less than 6 characters"})
        return
      }

      this.props.login(this.state.username, this.state.password)
    })()
  }

  render() {
    return (
      <View style={styles.screenContainer}>
        <Header title="Login" />
        <View style={styles.inputContainer}>
          <TextInput
            mode="outlined"
            placeholder="Username"
            onChangeText={this.onUsernameChange}
          />
          <TextInput
            mode="outlined"
            placeholder="Password"
            secureTextEntry={true}
            onChangeText={this.onPasswordChange}
            style={{
              marginTop: 8
            }}
          />
          <Button
            title="Login"
            onPress={this.onLoginPress}
            style={{
              marginTop: 8
            }}
          />
        </View>
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
  inputContainer: {
    display: "flex",
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    paddingHorizontal: 10
  }
});

const mapStateToProps = (state: AppState): StateProps => ({
  //no-op
});

const mapDispatchToProps: DispatchProps = {
  login
};


export default connect<StateProps, DispatchProps, OwnProps, AppState>(mapStateToProps, mapDispatchToProps)(Login);
