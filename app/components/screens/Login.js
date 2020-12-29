import React from "react";
import {StyleSheet} from "react-native";
import {Block, Button, Input} from "galio-framework";
import {loginUser} from "../../redux/Actions";
import {connect} from "react-redux";
import Theme from "../../constants/Theme";
import showPopup from "../Popup";

class Login extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: ""
    }
    this.onUsernameChange = this.onUsernameChange.bind(this);
    this.onPasswordChange = this.onPasswordChange.bind(this);
    this.onLoginPress = this.onLoginPress.bind(this);
  }

  onUsernameChange(username) {
    this.setState({
      username: username
    })
  }

  onPasswordChange(password) {
    this.setState({
      password: password
    })
  }

  onLoginPress() {
    if (!this.state.username) {
      showPopup("Username not provided", "Ok");
      return;
    }

    if (!this.state.password) {
      showPopup("Password not provided", "Ok");
      return;
    }

    if (this.state.password.length < 6) {
      showPopup("Password is less than 6 characters", "Ok");
      return;
    }

    this.props.loginUser(this.state.username, this.state.password);
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

const mapStateToProps = state => ({
  //no-op
});

const mapDispatchToProps = {
  loginUser
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
