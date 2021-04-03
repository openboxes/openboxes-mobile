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
    this.getLoginDisallowedReason = this.getLoginDisallowedReason.bind(this)
    this.login = this.login.bind(this)
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
      const username = this.state.username
      const password = this.state.password
      const loginDisallowedReason = this.getLoginDisallowedReason(username, password)
      if(loginDisallowedReason) {
        await showPopup({message: loginDisallowedReason})
      } else {
        await this.login(username, password)
      }
    })()
  }

  getLoginDisallowedReason(username: string, password: string): string | null {
    if(!username) {
      return "Username not provided"
    }

    if(!password) {
      return "Password not provided"
    }

    if(password.length < 6) {
      return "Password is less than 6 characters"
    }

    return null
  }

  async login(username: string, password: string) {
    try {
      this.props.login(username, password)
    } catch(e) {
      await showPopup({message: e.message ?? "Login failed"})
    }
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
