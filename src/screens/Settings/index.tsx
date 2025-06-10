import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { Caption, Card, Paragraph, Switch, TextInput } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';

import Button from '../../components/Button';
import * as NavigationService from '../../NavigationService';
import { setGroupLocationEntries } from '../../redux/actions/settings';
import { RootState } from '../../redux/reducers';
import ApiClient from '../../utils/ApiClient';
import { environment } from '../../utils/Environment';
import Theme from '../../utils/Theme';
import styles from './styles';

const Settings = () => {
  const dispatch = useDispatch();

  const [serverUrl, setServerUrl] = useState('');

  const groupLocationEntries = useSelector((state: RootState) => state.settingsReducer.groupLocationEntries);

  useEffect(() => {
    AsyncStorage.getItem('API_URL').then((url) => {
      setServerUrl(url || environment.API_BASE_URL);
    });
  }, []);

  const handleServerUrlSave = () => {
    ApiClient.setBaseUrl(serverUrl);
    AsyncStorage.setItem('API_URL', serverUrl).then(() => {
      NavigationService.goBack();
    });
  };

  const handleToggleGroupEntries = () => {
    dispatch(setGroupLocationEntries(!groupLocationEntries));
  };

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Title title="Server Connection" />
        <Card.Content>
          <Paragraph style={styles.paragraph}>
            Set the server URL that will serve as the backend for the mobile application.
          </Paragraph>
          <TextInput
            style={styles.input}
            mode="outlined"
            label="Server URL"
            placeholder="http://localhost:8080/"
            value={serverUrl}
            onChangeText={(text) => {
              setServerUrl(text);
            }}
          />
          <Button mode="contained" size="100%" title="Save and Apply" onPress={handleServerUrlSave} />
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Title title="UI Preferences" />
        <Card.Content>
          <View style={styles.settingRow}>
            <View style={styles.settingTextContainer}>
              <Paragraph>Group Location Entries</Paragraph>
              <Caption>Displays locations from the same organization in a collapsible list.</Caption>
            </View>
            <Switch
              value={groupLocationEntries}
              color={Theme.colors.primary}
              onValueChange={handleToggleGroupEntries}
            />
          </View>
        </Card.Content>
      </Card>
    </ScrollView>
  );
};

export default Settings;
