import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
<<<<<<< HEAD
import { ScrollView } from 'react-native';
import { Card, Paragraph, TextInput } from 'react-native-paper';
=======
import { ScrollView, View } from 'react-native';
import { Caption, Card, IconButton, Paragraph, Switch, TextInput } from 'react-native-paper';
>>>>>>> develop
import { useDispatch, useSelector } from 'react-redux';

import Button from '../../components/Button';
import showPopup from '../../components/Popup';
import * as NavigationService from '../../NavigationService';
import {
  resetDashboardEntriesVisibility,
  setDashboardEntriesVisibility,
<<<<<<< HEAD
  setGroupLocationEntries,
  setProductSummaryConfig,
  SettingsActionTypes
=======
  setGroupLocationEntries
>>>>>>> develop
} from '../../redux/actions/settings';
import { RootState } from '../../redux/reducers';
import ApiClient from '../../utils/ApiClient';
import { environment } from '../../utils/Environment';
<<<<<<< HEAD
import { DashboardEntry, getDashboardEntries } from '../Dashboard/dashboardData';
import { getProductSummaryConfig, ProductSummaryItem } from './productSummaryConfig';
=======
import Theme from '../../utils/Theme';
import { DashboardEntry, getDashboardEntries } from '../Dashboard/dashboardData';
>>>>>>> develop
import styles from './styles';
import { ToggleCard } from './ToggleCard';
import { ToggleRow } from './ToggleRow';

const API_URL_KEY = 'API_URL';

const Settings = () => {
  const dispatch = useDispatch();
<<<<<<< HEAD
  const { groupLocationEntries, dashboardEntriesVisibility, productSummaryConfig } = useSelector(
    (state: RootState) => state.settingsReducer
  );
=======
  const { groupLocationEntries, dashboardEntriesVisibility } = useSelector((state: RootState) => state.settingsReducer);
>>>>>>> develop

  const [serverUrl, setServerUrl] = useState<string>('');

  useEffect(() => {
<<<<<<< HEAD
    AsyncStorage.getItem(API_URL_KEY)
=======
    AsyncStorage.getItem('API_URL')
>>>>>>> develop
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
<<<<<<< HEAD
    AsyncStorage.setItem(API_URL_KEY, serverUrl)
=======
    AsyncStorage.setItem('API_URL', serverUrl)
>>>>>>> develop
      .then(() => {
        NavigationService.goBack();
      })
      .catch((err) => {
        console.warn('Failed to save API_URL:', err);
      });
  }, [serverUrl]);

<<<<<<< HEAD
  const askResetDashboard = useCallback(() => {
    showPopup({
      title: 'Reset Dashboard Entries',
      message: 'Are you sure you want to reset the dashboard entries ' + 'to their default visibility?',
      positiveButton: {
        text: 'Reset',
        callback: () => dispatch(resetDashboardEntriesVisibility())
      },
      negativeButtonText: 'Cancel'
    });
  }, [dispatch]);

  const toggleGroup = useCallback(() => {
    dispatch(setGroupLocationEntries(!groupLocationEntries));
  }, [dispatch, groupLocationEntries]);

  const isVisible = useCallback(
    (entry: DashboardEntry | ProductSummaryItem, map: { [key: string]: boolean }): boolean =>
      map?.[entry.key] !== undefined ? map[entry.key] : entry.defaultVisible ?? true,
    []
  );

  const handleToggle = useCallback(
    (
      entity: ProductSummaryItem | DashboardEntry,
      map: { [key: string]: boolean },
      actionCreator: (key: string, visible: boolean) => SettingsActionTypes
    ) => {
      const current = isVisible(entity, map);
      dispatch(actionCreator(entity.key, !current));
    },
    [dispatch, isVisible]
=======
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
>>>>>>> develop
  );

  const dashboardEntries = useMemo(() => getDashboardEntries(), []);

<<<<<<< HEAD
  const productConfigEntries = useMemo(() => getProductSummaryConfig(), []);
=======
  const handleDefaultDashboardEntries = useCallback(() => {
    dispatch(resetDashboardEntriesVisibility());
  }, [dispatch]);
>>>>>>> develop

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
<<<<<<< HEAD
      <ToggleCard title="Customization">
        <ToggleRow
          title="Group Location Entries"
          description="Displays locations from the same organization in a collapsible list."
          value={groupLocationEntries}
          onValueChange={toggleGroup}
        />
      </ToggleCard>

      {/* Dashboard Entries */}
      {dashboardEntries.length > 0 && (
        <ToggleCard title="Menu Entries" subtitle="Toggle visibility of dashboard entries." onReset={askResetDashboard}>
          {dashboardEntries.map((entry) => (
            <ToggleRow
              key={entry.key}
              title={entry.screenName}
              description={entry.entryDescription}
              value={isVisible(entry, dashboardEntriesVisibility)}
              onValueChange={() => handleToggle(entry, dashboardEntriesVisibility, setDashboardEntriesVisibility)}
            />
          ))}
        </ToggleCard>
      )}

      {/* Product Summary */}
      <ToggleCard lastChild title="Product Summary" subtitle="Toggle visibility of particular product detail.">
        {productConfigEntries.map((item) => (
          <ToggleRow
            key={item.key}
            title={item.title}
            description={item.description}
            value={isVisible(item, productSummaryConfig)}
            onValueChange={() => handleToggle(item, productSummaryConfig, setProductSummaryConfig)}
          />
        ))}
      </ToggleCard>
=======
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
>>>>>>> develop
    </ScrollView>
  );
};

export default Settings;
