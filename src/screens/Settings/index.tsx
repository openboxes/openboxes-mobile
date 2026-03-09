import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ScrollView } from 'react-native';
import { Card, Paragraph, Text, TextInput } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';

import Button from '../../components/Button';
import showPopup from '../../components/Popup';
import { appConfig } from '../../constants';
import * as NavigationService from '../../NavigationService';
import {
  resetDashboardEntriesVisibility,
  setAllowReallocationDuringPicking,
  setBarcodeScanDebounce,
  setDashboardEntriesOrder,
  setGroupLocationEntries,
  setProductSummaryConfig,
  SettingsActionTypes
} from '../../redux/actions/settings';
import { RootState } from '../../redux/reducers';
import ApiClient from '../../utils/ApiClient';
import { environment } from '../../utils/Environment';
import { DashboardEntry } from '../Dashboard/dashboardData';
import { DashboardEntriesList } from '../Dashboard/DashboardEntriesList';
import { ToggleCard } from '../Dashboard/ToggleCard';
import { ToggleRow } from '../Dashboard/ToggleRow';
import { getProductSummaryConfig, ProductSummaryItem } from './productSummaryConfig';
import styles from './styles';

const API_URL_KEY = 'API_URL';

const Settings = () => {
  const [serverUrl, setServerUrl] = useState<string>('');
  const dispatch = useDispatch();
  const { groupLocationEntries, allowReallocationDuringPicking, productSummaryConfig, barcodeScanDebounceTime } =
    useSelector((state: RootState) => state.settingsReducer);
  const [debounceInput, setDebounceInput] = useState<string>(
    barcodeScanDebounceTime?.toString() ?? appConfig.DEFAULT_DEBOUNCE_TIME.toString()
  );

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
      message: 'Are you sure you want to reset dashboard entries to their ' + 'default order & visibility?',
      positiveButton: {
        text: 'Reset',
        callback: () => {
          dispatch(resetDashboardEntriesVisibility());
          dispatch(setDashboardEntriesOrder([]));
        }
      },
      negativeButtonText: 'Cancel'
    });
  }, [dispatch]);

  const toggleGroup = useCallback(() => {
    dispatch(setGroupLocationEntries(!groupLocationEntries));
  }, [dispatch, groupLocationEntries]);

  const toggleAllowReallocationDuringPicking = useCallback(() => {
    dispatch(setAllowReallocationDuringPicking(!allowReallocationDuringPicking));
  }, [dispatch, allowReallocationDuringPicking]);

  const handleDebounceChange = useCallback(
    (text: string) => {
      const numericValue = text.replace(/[^0-9]/g, '');
      setDebounceInput(numericValue);
      const value = parseInt(numericValue, 10);
      if (!isNaN(value) && value >= 0) {
        dispatch(setBarcodeScanDebounce(value));
      }
    },
    [dispatch]
  );

  const askResetDebounce = useCallback(() => {
    showPopup({
      title: 'Reset Scanning Debounce',
      message: `Are you sure you want to reset scanning debounce to default (${appConfig.DEFAULT_DEBOUNCE_TIME}ms)?`,
      positiveButton: {
        text: 'Reset',
        callback: () => {
          dispatch(setBarcodeScanDebounce(appConfig.DEFAULT_DEBOUNCE_TIME));
          setDebounceInput(appConfig.DEFAULT_DEBOUNCE_TIME.toString());
        }
      },
      negativeButtonText: 'Cancel'
    });
  }, [dispatch]);

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
            autoCompleteType="off"
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
        <ToggleRow
          title="Allow Reallocation During Picking"
          description="Enables reallocation during the picking process, allowing users to change the source location of items while picking."
          value={allowReallocationDuringPicking}
          onValueChange={toggleAllowReallocationDuringPicking}
        />
      </ToggleCard>

      {/* Scanner Settings */}
      <ToggleCard title="Scanner Settings">
        <Paragraph style={styles.paragraph}>Configure barcode scanner behavior.</Paragraph>
        <TextInput
          autoCompleteType="off"
          style={styles.input}
          mode="outlined"
          label="Scanning Debounce [ms]"
          placeholder="e.g., 100"
          value={debounceInput}
          keyboardType="numeric"
          onChangeText={handleDebounceChange}
        />
        <Paragraph style={styles.paragraphSmall}>
          Time in milliseconds to wait after scanning before auto-submitting.{' '}
          {barcodeScanDebounceTime !== undefined && barcodeScanDebounceTime !== appConfig.DEFAULT_DEBOUNCE_TIME && (
            <Text style={styles.link} onPress={askResetDebounce}>
              Reset to default.
            </Text>
          )}
        </Paragraph>
      </ToggleCard>

      <ToggleCard title="Menu Entries" subtitle="Toggle & reorder dashboard entries." onReset={askResetDashboard}>
        <DashboardEntriesList />
      </ToggleCard>

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
