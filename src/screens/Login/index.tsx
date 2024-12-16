/* eslint-disable react-native/no-inline-styles */
import React, { useState } from 'react';
import { View } from 'react-native';
import styles from './styles';
import { useDispatch } from 'react-redux';
import { login } from '../../redux/actions/auth';
import showPopup from '../../components/Popup';
import { Caption, TextInput } from 'react-native-paper';
import Button from '../../components/Button';
import * as NavigationService from '../../NavigationService';
import { Image } from 'react-native';
import { Headline } from 'react-native-paper';

import { StackNavigationProp } from '@react-navigation/stack';
import { StackList } from '../../types/navigationTypes';
// @ts-ignore
import EYE_SHOW from '../../assets/images/eye_show.png';
// @ts-ignore
import EYE_HIDE from '../../assets/images/eye_hide.png';

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
        <Image source={require('../../assets/images/logo.png')} resizeMode={'cover'} />
        <Headline style={{ fontWeight: 'bold' }}>Welcome Back!</Headline>
        <Caption>Sign in to continue</Caption>
      </View>
      <View style={styles.inputsContainer}>
        <TextInput mode="flat" label={'Username'} placeholder="Username" onChangeText={onUsernameChange} />
        <TextInput
          mode="flat"
          placeholder="Password"
          label={'Password'}
          secureTextEntry={state.isSeePassword}
          right={<TextInput.Icon name={state.isSeePassword ? EYE_SHOW : EYE_HIDE} onPress={onPasswordClick} />}
          style={{
            marginTop: 8
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
