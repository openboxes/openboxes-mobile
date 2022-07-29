/* eslint-disable react-native/no-inline-styles */
import React, { useState } from 'react';
import { View } from 'react-native';
import styles from './styles';
import { common, margin } from '../../assets/styles';
import { useDispatch } from 'react-redux';
import { login } from '../../redux/actions/auth';
import showPopup from '../../components/Popup';
import { TextInput } from 'react-native-paper';
import Button from '../../components/Button';
import * as NavigationService from '../../NavigationService';
import { LoginState } from './types';

// @ts-ignore
import EYE_SHOW from '../../assets/images/eye_show.png';
// @ts-ignore
import EYE_HIDE from '../../assets/images/eye_hide.png';

const Login = () => {
  const dispatch = useDispatch();
  const [state, setState] = useState<LoginState>({
    username: '',
    password: '',
    isSeePassword: true
  });

  const onUsernameChange = (username: string) => {
    setState({
      ...state,
      username: username
    });
  };

  const onPasswordChange = (password: string) => {
    setState({
      ...state,
      password: password
    });
  };

  const onLoginPress = () => {
    const { username, password } = state;
    const loginDisallowedReason = getLoginDisallowedReason(username, password);
    if (loginDisallowedReason) {
      showPopup({ message: loginDisallowedReason, positiveButton: 'ok' });
    } else {
      onLogin(username, password);
    }
  };

  const getLoginDisallowedReason = (username: string, password: string): string | null => {
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

  const onLogin = (username: string, password: string) => {
    try {
      dispatch(login({ username, password }));
    } catch (e) {
      showPopup({ message: e.message ?? 'Login failed' });
    }
  };
  const onPasswordClick = () => {
    setState({ ...state, isSeePassword: !state.isSeePassword });
  };

  return (
    <View style={[common.containerFlexColumn, common.flex1]}>
      <View style={styles.inputContainer}>
        <TextInput mode="outlined" label={'Username'} placeholder="Username" onChangeText={onUsernameChange} />
        <TextInput
          mode="outlined"
          placeholder="Password"
          label={'Password'}
          secureTextEntry={state.isSeePassword}
          right={<TextInput.Icon name={state.isSeePassword ? EYE_SHOW : EYE_HIDE} onPress={onPasswordClick} />}
          style={margin.MT2}
          onChangeText={onPasswordChange}
        />
        <Button title="Login" onPress={onLoginPress} />
        <Button
          title="Settings"
          onPress={() => {
            NavigationService.navigate('Settings');
          }}
        />
      </View>
    </View>
  );
};

export default Login;
