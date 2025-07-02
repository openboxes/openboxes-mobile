import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { Caption, Card, IconButton, Paragraph, Switch, TextInput } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';

import Button from '../../components/Button';
import showPopup from '../../components/Popup';
import * as NavigationService from '../../NavigationService';
import {
  resetDashboardEntriesVisibility,
  setDashboardEntriesVisibility,
  setGroupLocationEntries
} from '../../redux/actions/settings';
import { RootState } from '../../redux/reducers';
import ApiClient from '../../utils/ApiClient';
import { environment } from '../../utils/Environment';
import Theme from '../../utils/Theme';
import { DashboardEntry, getDashboardEntries } from '../Dashboard/dashboardData';
import styles from './styles';

const Settings = () => {
  const dispatch = useDispatch();
  const { groupLocationEntries, dashboardEntriesVisibility } = useSelector((state: RootState) => state.settingsReducer);

  const [serverUrl, setServerUrl] = useState<string>('');

  useEffect(() => {
    AsyncStorage.getItem('API_URL')
      .then((url) => {
        setServerUrl(url ?? environment.API_BASE_URL);
      })
      .catch((err) => {
        console.warn('Failed to load API_URL:', err);
        setServerUrl(environment.API_BASE_URL);
      });
  }, []);

  const handleServerUrlSave = useCallback(() => {
    ApiClient.setBaseUrl(serverUrl);
    AsyncStorage.setItem('API_URL', serverUrl)
      .then(() => {
        NavigationService.goBack();
      })
      .catch((err) => {
        console.warn('Failed to save API_URL:', err);
      });
  }, [serverUrl]);

  const toggleGroupEntries = useCallback(() => {
    dispatch(setGroupLocationEntries(!groupLocationEntries));
  }, [dispatch, groupLocationEntries]);

  const isEntryVisible = useCallback(
    (entry: DashboardEntry): boolean => {
      const preference = dashboardEntriesVisibility?.[entry.key];
      if (preference !== undefined) {
        return preference;
      }

      return entry.defaultVisible ?? true;
    },
    [dashboardEntriesVisibility]
  );

  const handleDashboardEntryToggle = useCallback(
    (entry: DashboardEntry) => {
      const current = isEntryVisible(entry);
      dispatch(setDashboardEntriesVisibility(entry.key, !current));
    },
    [dispatch, isEntryVisible]
  );

  const dashboardEntries = useMemo(() => getDashboardEntries(), []);

  const handleDefaultDashboardEntries = useCallback(() => {
    dispatch(resetDashboardEntriesVisibility());
  }, [dispatch]);

  return (
    <ScrollView style={styles.container}>
      {/* Server Connection */}
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
            onChangeText={setServerUrl}
          />
          <Button mode="contained" size="100%" title="Save and Apply" onPress={handleServerUrlSave} />
        </Card.Content>
      </Card>

      {/* Group Location Entries */}
      <Card style={styles.card}>
        <Card.Title title="Customization" />
        <Card.Content>
          <View style={styles.settingRow}>
            <View style={styles.settingTextContainer}>
              <Paragraph>Group Location Entries</Paragraph>
              <Caption>Displays locations from the same organization in a collapsible list.</Caption>
            </View>
            <Switch value={groupLocationEntries} color={Theme.colors.primary} onValueChange={toggleGroupEntries} />
          </View>
        </Card.Content>
      </Card>

      {/* Dashboard Entries */}
      {dashboardEntries.length > 0 && (
        <Card style={[styles.card, { marginBottom: Theme.spacing.large }]}>
          <Card.Title
            title="Menu Entries"
            subtitle="Toggle visibility of dashboard entries."
            right={() => (
              <IconButton
                icon="refresh"
                color={Theme.colors.primary}
                size={24}
                style={{ marginRight: Theme.spacing.medium }}
                accessibilityLabel="Reset to Default Entries"
                onPress={() =>
                  showPopup({
                    title: 'Reset Dashboard Entries',
                    message: 'Are you sure you want to reset the dashboard entries to their default visibility?',
                    positiveButton: {
                      text: 'Reset',
                      callback: handleDefaultDashboardEntries
                    },
                    negativeButtonText: 'Cancel'
                  })
                }
              />
            )}
          />
          <Card.Content>
            {dashboardEntries.map((entry) => (
              <View key={entry.key} style={styles.settingRow}>
                <View style={styles.settingTextContainer}>
                  <Paragraph>{entry.screenName}</Paragraph>
                  <Caption>{entry.entryDescription ?? ''}</Caption>
                </View>
                <Switch
                  value={isEntryVisible(entry)}
                  color={Theme.colors.primary}
                  onValueChange={() => handleDashboardEntryToggle(entry)}
                />
              </View>
            ))}
          </Card.Content>
        </Card>
      )}
    </ScrollView>
  );
};

export default Settings;
