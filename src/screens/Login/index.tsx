import React, {Component} from 'react';
import {View} from 'react-native';
import styles from './styles';
import {connect} from 'react-redux';
import {login} from '../../redux/actions/auth';
import showPopup from '../../components/Popup';
import {TextInput} from 'react-native-paper';
import Header from '../../components/Header';
import Button from '../../components/Button';
import {RootState} from '../../redux/reducers';

import {StackNavigationProp} from '@react-navigation/stack';
import {StackList} from '../../types/navigationTypes';

type ProfileScreenNavigationProp = StackNavigationProp<StackList, 'Login'>;

interface OwnProps {
  navigation: ProfileScreenNavigationProp;
}

interface StateProps {
  //no-op
}

interface DispatchProps {
  login: (data: any) => void;
}

type Props = OwnProps & StateProps & DispatchProps;

interface State {
  username: string;
  password: string;
}

class Login extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      username: '',
      password: '',
    };
  }

  onUsernameChange = (username: string) => {
    this.setState({
      username: username,
    });
  };

  onPasswordChange = (password: string) => {
    this.setState({
      password: password,
    });
  };

  onLoginPress = () => {
    const {username, password} = this.state;
    const loginDisallowedReason = this.getLoginDisallowedReason(
      username,
      password,
    );
    if (loginDisallowedReason) {
      showPopup({message: loginDisallowedReason});
    } else {
      this.login(username, password);
    }
  };

  getLoginDisallowedReason = (
    username: string,
    password: string,
  ): string | null => {
    if (!username) {
      return 'Username not provided';
    }

    if (!password) {
      return 'Password not provided';
    }

    if (password.length < 6) {
      return 'Password is less than 6 characters';
    }

    return null;
  };

  login = (username: string, password: string) => {
    try {
      this.props.login({username, password});
    } catch (e) {
      showPopup({message: e.message ?? 'Login failed'});
    }
  };

  render() {
    return (
      <View style={styles.screenContainer}>
        <Header title="Login" backButtonVisible={false} />
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
              marginTop: 8,
            }}
          />
          <Button
            title="Login"
            onPress={this.onLoginPress}
            style={{
              marginTop: 8,
            }}
          />
        </View>
      </View>
    );
  }
}

const mapStateToProps = (state: RootState) => ({
  //no-op
});

const mapDispatchToProps: DispatchProps = {
  login,
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
