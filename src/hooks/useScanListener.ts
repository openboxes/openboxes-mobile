import { useEffect, useRef } from 'react';
import { DeviceEventEmitter, Platform } from 'react-native';
import DataWedgeIntents from 'react-native-datawedge-intents';
import DeviceInfo from 'react-native-device-info';

import {
  ACTION,
  FILTER_ACTIONS,
  FILTER_CATEGORY,
  getKeystrokeOutputConfig,
  getProfileConfig,
  INTENT_OUTPUT_CONFIG,
  LISTENER,
  PROFILE
} from './constant';

export type ScanResult = {
  data: string;
  labelType?: string;
};

let profileConfigured = false;

// Number of barcode inputs currently listening for scans. Keystroke output is
// muted while this is > 0 (see below).
let activeConsumerCount = 0;

function sendDataWedgeCommand(extraName: string, extraValue: string): void {
  DataWedgeIntents.sendBroadcastWithExtras({
    action: ACTION.API_ACTION,
    extras: { [extraName]: extraValue, SEND_RESULT: 'false' }
  });
}

// A profile config is a nested bundle, and the native bridge builds it by calling
// String.valueOf() on whatever it is given and re-parsing that as JSON. Handing it a
// plain object therefore serialises a Java Map ("{PROFILE_ENABLED=true, ...}"), whose
// unquoted values parse back as booleans and numbers - DataWedge then rejects them
// ("Key PROFILE_ENABLED expected String but value was a java.lang.Boolean"), leaves the
// profile disabled and never sends the scan broadcast. Passing real JSON keeps every
// value the String that DataWedge expects.
function sendDataWedgeConfig(config: Record<string, unknown>): void {
  sendDataWedgeCommand(PROFILE.SET_CONFIG_PROFILE, JSON.stringify(config));
}

function configureProfileOnce(): void {
  if (profileConfigured) {
    return;
  }
  profileConfigured = true;
  sendDataWedgeCommand(PROFILE.CREATE_PROFILE, PROFILE.NAME);
  sendDataWedgeConfig(getProfileConfig(DeviceInfo.getBundleId()));
  sendDataWedgeConfig(INTENT_OUTPUT_CONFIG);
}

function setKeystrokeOutput(enabled: boolean): void {
  sendDataWedgeConfig(getKeystrokeOutputConfig(enabled));
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
