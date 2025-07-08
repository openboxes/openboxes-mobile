import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ScrollView } from 'react-native';
import { Card, Paragraph, TextInput } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';

import Button from '../../components/Button';
import showPopup from '../../components/Popup';
import * as NavigationService from '../../NavigationService';
import {
  resetDashboardEntriesVisibility,
  setDashboardEntriesVisibility,
  setGroupLocationEntries,
  setProductSummaryConfig,
  SettingsActionTypes
} from '../../redux/actions/settings';
import { RootState } from '../../redux/reducers';
import ApiClient from '../../utils/ApiClient';
import { environment } from '../../utils/Environment';
import { DashboardEntry, getDashboardEntries } from '../Dashboard/dashboardData';
import { getProductSummaryConfig, ProductSummaryItem } from './productSummaryConfig';
import styles from './styles';
import { ToggleCard } from './ToggleCard';
import { ToggleRow } from './ToggleRow';

const API_URL_KEY = 'API_URL';

const Settings = () => {
  const dispatch = useDispatch();
  const { groupLocationEntries, dashboardEntriesVisibility, productSummaryConfig } = useSelector(
    (state: RootState) => state.settingsReducer
  );

  const [serverUrl, setServerUrl] = useState<string>('');

  useEffect(() => {
    AsyncStorage.getItem(API_URL_KEY)
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
    AsyncStorage.setItem(API_URL_KEY, serverUrl)
      .then(() => {
        NavigationService.goBack();
      })
      .catch((err) => {
        console.warn('Failed to save API_URL:', err);
      });
  }, [serverUrl]);

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
  );

  const dashboardEntries = useMemo(() => getDashboardEntries(), []);

  const productConfigEntries = useMemo(() => getProductSummaryConfig(), []);

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
    </ScrollView>
  );
};

export default Settings;
