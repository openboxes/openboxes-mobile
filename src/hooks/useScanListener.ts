import { useEffect, useRef } from 'react';
import { DeviceEventEmitter, Platform } from 'react-native';
import DataWedgeIntents from 'react-native-datawedge-intents';

import {
  ACTION,
  FILTER_ACTIONS,
  FILTER_CATEGORY,
  getKeystrokeOutputConfig,
  LISTENER,
  PROFILE,
  PROFILE_CONFIG,
  PROFILE_CONFIG2
} from './constant';

export type ScanResult = {
  data: string;
  labelType?: string;
};

let profileConfigured = false;

// Number of barcode inputs currently listening for scans. Keystroke output is
// muted while this is > 0 (see below).
let activeConsumerCount = 0;

function sendDataWedgeCommand(extraName: string, extraValue: unknown): void {
  DataWedgeIntents.sendBroadcastWithExtras({
    action: ACTION.API_ACTION,
    extras: { [extraName]: extraValue, SEND_RESULT: 'false' }
  });
}

function configureProfileOnce(): void {
  if (profileConfigured) {
    return;
  }
  profileConfigured = true;
  sendDataWedgeCommand(PROFILE.CREATE_PROFILE, PROFILE.NAME);
  sendDataWedgeCommand(PROFILE.SET_CONFIG_PROFILE, PROFILE_CONFIG);
  sendDataWedgeCommand(PROFILE.SET_CONFIG_PROFILE, PROFILE_CONFIG2);
}

function setKeystrokeOutput(enabled: boolean): void {
  sendDataWedgeCommand(PROFILE.SET_CONFIG_PROFILE, getKeystrokeOutputConfig(enabled));
}

function extractScan(intent: Record<string, any>): ScanResult | null {
  const data = intent?.[ACTION.DATA_STRING] ?? intent?.data;
  if (!data) {
    return null;
  }
  const labelType = intent?.[ACTION.LABEL_TYPE] ?? intent?.labelType;
  return { data: String(data).trim(), labelType: labelType ? String(labelType) : undefined };
}

export function useScanListener(onScan: (result: ScanResult) => void, enabled = true): void {
  const onScanRef = useRef(onScan);
  onScanRef.current = onScan;

  useEffect(() => {
    if (!enabled || Platform.OS !== 'android' || !DataWedgeIntents?.registerBroadcastReceiver) {
      return;
    }

    configureProfileOnce();
    DataWedgeIntents.registerBroadcastReceiver({
      filterActions: FILTER_ACTIONS,
      filterCategories: FILTER_CATEGORY
    });

    // A barcode input is now listening via the intent broadcast. While any is
    // active, mute DataWedge keystroke output so the scan is not also typed into
    // the focused field (which would duplicate/append the value). Reference
    // counted so overlapping inputs (e.g. a screen input and a modal input) keep
    // it muted until the last one goes away, then restore it for plain inputs.
    activeConsumerCount += 1;
    if (activeConsumerCount === 1) {
      setKeystrokeOutput(false);
    }

    const handleIntent = (intent: Record<string, any>) => {
      const result = extractScan(intent);
      if (result) {
        onScanRef.current(result);
      }
    };

    const subscription = DeviceEventEmitter.addListener(LISTENER.BROADCAST_INTENT, handleIntent);
    return () => {
      subscription.remove();
      activeConsumerCount -= 1;
      if (activeConsumerCount === 0) {
        setKeystrokeOutput(true);
      }
    };
  }, [enabled]);
}
