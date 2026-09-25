import React, { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { useSelector } from 'react-redux';

import { RootState } from '../redux/reducers';

export type ScanResult = 'pass' | 'fail';

const FLASH_COLORS: Record<ScanResult, string> = {
  pass: '#1EB200',
  fail: '#D02C2F'
};
const PEAK_OPACITY = 0.92;
const RISE_MS = 40;
const HOLD_MS = 120;
const FADE_MS = 140;

type ScanFlashContextValue = {
  flash: (result: ScanResult, onDone?: () => void) => void;
  isFlashing: boolean;
};

const ScanFlashContext = createContext<ScanFlashContextValue>({
  flash: (_result, onDone) => onDone?.(),
  isFlashing: false
});

export function ScanFlashProvider({ children }: { children: React.ReactNode }) {
  // Persisted settings from before this option existed have no value for it.
  const isEnabled = useSelector((state: RootState) => state.settingsReducer.scanFlashEnabled ?? true);
  const opacity = useRef(new Animated.Value(0)).current;
  const [result, setResult] = useState<ScanResult | null>(null);

  const flash = useCallback(
    (next: ScanResult, onDone?: () => void) => {
      if (!isEnabled) {
        onDone?.();
        return;
      }

      opacity.stopAnimation();
      opacity.setValue(0);
      setResult(next);
      Animated.sequence([
        Animated.timing(opacity, { toValue: PEAK_OPACITY, duration: RISE_MS, useNativeDriver: true }),
        Animated.delay(HOLD_MS),
        Animated.timing(opacity, { toValue: 0, duration: FADE_MS, useNativeDriver: true })
      ]).start(({ finished }) => {
        onDone?.();
        if (finished) {
          setResult(null);
        }
      });
    },
    [isEnabled, opacity]
  );

  const value = useMemo(() => ({ flash, isFlashing: result !== null }), [flash, result]);

  return (
    <ScanFlashContext.Provider value={value}>
      <View style={styles.root}>
        {children}
        {result && (
          <Animated.View
            pointerEvents="none"
            style={[StyleSheet.absoluteFill, { backgroundColor: FLASH_COLORS[result], opacity }]}
          />
        )}
      </View>
    </ScanFlashContext.Provider>
  );
}

export function useScanFlash() {
  return useContext(ScanFlashContext);
}

const styles = StyleSheet.create({
  root: {
    flex: 1
  }
});
