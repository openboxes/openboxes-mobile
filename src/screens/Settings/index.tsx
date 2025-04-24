import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { TextInput } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { environment } from '../../utils/Environment';
import * as NavigationService from '../../NavigationService';
import ApiClient from '../../utils/ApiClient';
import Button from '../../components/Button';
import styles from './styles';

const Settings = () => {
  const [value, setValue] = useState('');

  useEffect(() => {
    AsyncStorage.getItem('API_URL').then((url) => {
      setValue(url || environment.API_BASE_URL);
    });
  }, []);

  const handlePress = () => {
    ApiClient.setBaseUrl(value);
    AsyncStorage.setItem('API_URL', value).then(() => {
      NavigationService.navigate('Login');
    });
  };

  return (
    <View style={styles.card}>
      <Text>Here, you can enter the server URL, which will serve as the backend for the mobile app.</Text>
      <TextInput
        style={styles.input}
        mode="outlined"
        label="Server URL"
        placeholder="http://localhost:8080/"
        value={value}
        onChangeText={(text) => {
          setValue(text);
        }}
      />
      <Button size="100%" title="Confirm" onPress={handlePress} />
    </View>
  );
};

export default Settings;
