import React, { FC, useEffect, useState } from 'react';
import { View } from 'react-native';
import { TextInput } from 'react-native-paper';
import { Props } from './types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { environment } from '../../utils/Environment';
import * as NavigationService from '../../NavigationService';
import ApiClient from '../../utils/ApiClient';
import Button from '../../components/Button';
import { common, margin } from '../../assets/styles';

const Settings: FC<Props> = ({}) => {
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
    <View style={[common.flex1, margin.M3]}>
      <TextInput label="URL" placeholder="API URL" mode="outlined" value={value} onChangeText={setValue} />
      <Button disabled={false} title="Go" onPress={handlePress} />
    </View>
  );
};

export default Settings;
