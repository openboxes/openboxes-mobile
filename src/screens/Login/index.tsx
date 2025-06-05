/* eslint-disable react-native/no-inline-styles */
import React, { useState } from 'react';
import { Image, View } from 'react-native';
import { TextInput } from 'react-native-paper';
import { useDispatch } from 'react-redux';

import EyeIcon from '../../assets/images/icon_eye.svg';
import EyeSlashIcon from '../../assets/images/icon_eye_slash.svg';
import Button from '../../components/Button';
import showPopup from '../../components/Popup';
import * as NavigationService from '../../NavigationService';
import { login } from '../../redux/actions/auth';
import Theme from '../../utils/Theme';
import styles from './styles';

const Login = () => {
  const dispatch = useDispatch();
  const [state, setState] = useState<any>({
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
    <View style={styles.screenContainer}>
      <View style={styles.welcomeContainer}>
        <Image source={require('../../assets/images/logo.png')} style={styles.logo} resizeMode="contain" />
      </View>
      <View style={styles.inputsContainer}>
        <TextInput mode="flat" label={'Username'} placeholder="Username" onChangeText={onUsernameChange} />
        <TextInput
          mode="flat"
          placeholder="Password"
          label={'Password'}
          secureTextEntry={state.isSeePassword}
          right={
            <TextInput.Icon
              icon={() =>
                state.isSeePassword ? <EyeIcon width={24} height={24} /> : <EyeSlashIcon width={24} height={24} />
              }
              onPress={onPasswordClick}
            />
          }
          style={{
            marginTop: Theme.spacing.small
          }}
          onChangeText={onPasswordChange}
        />
      </View>
      <View style={styles.buttonsContainer}>
        <Button title="Login" size="100%" style={{ marginBottom: 8 }} onPress={onLoginPress} />
        <Button
          title="Settings"
          size="100%"
          mode="text"
          onPress={() => {
            NavigationService.navigate('Settings');
          }}
        />
      </View>
    </View>
  );
};

export default Login;
