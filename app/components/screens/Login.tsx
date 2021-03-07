import React from "react";
import {StyleSheet} from "react-native";
// @ts-ignore
import {Block, Button, Input} from "galio-framework";
import {loginUser} from "../../redux/Dispatchers";
import {connect} from "react-redux";
import Theme from "../../constants/Theme";
import showPopup from "../Popup";
import {AppState} from "../../redux/Reducer";

export interface OwnProps {
  //no-op
}

interface StateProps {
  //no-op
}

interface DispatchProps {
  loginUser: (username: string, password: string) => void;
}

type Props = OwnProps & StateProps & DispatchProps;

interface State {
  username: string;
  password: string;
}

class Login extends React.Component<Props, State> {

  constructor(props: Props) {
    super(props);
    this.state = {
      username: "",
      password: ""
    }
    this.onUsernameChange = this.onUsernameChange.bind(this);
    this.onPasswordChange = this.onPasswordChange.bind(this);
    this.onLoginPress = this.onLoginPress.bind(this);
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
        await showPopup({message: "Username not provided"});
        return;
      }

      if (!this.state.password) {
        await showPopup({message: "Password not provided"});
        return;
      }

      if (this.state.password.length < 6) {
        await showPopup({message:"Password is less than 6 characters"});
        return;
      }

      this.props.loginUser(this.state.username, this.state.password);
    })()
  }

  render() {
    return (
      <Block flex middle style={styles.container}>
        <Input
          placeholder="Username"
          placeholderTextColor={Theme.COLORS.PLACEHOLDER}
          color={Theme.COLORS.BLACK}
          onChangeText={this.onUsernameChange}
        />
        <Input
          placeholder="Password"
          placeholderTextColor={Theme.COLORS.PLACEHOLDER}
          color={Theme.COLORS.BLACK}
          password
          onChangeText={this.onPasswordChange}
        />
        <Button onPress={this.onLoginPress}>Login</Button>
      </Block>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10
  }
});

const mapStateToProps = (state: AppState): StateProps => ({
  //no-op
});

const mapDispatchToProps: DispatchProps = {
  loginUser
};


export default connect<StateProps, DispatchProps, OwnProps, AppState>(mapStateToProps, mapDispatchToProps)(Login);
