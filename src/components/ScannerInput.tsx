import { useIsFocused } from '@react-navigation/native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  AppState,
  InteractionManager,
  Keyboard,
  TextInput as NativeTextInput,
  StyleProp,
  ViewStyle
} from 'react-native';
import { TextInput as PaperTextInput } from 'react-native-paper';
import { useSelector } from 'react-redux';

import { isString } from 'lodash';
import { appConfig } from '../constants';
import { useScanListener } from '../hooks/useScanListener';
import { RootState } from '../redux/reducers';
import { hideSoftKeyboard, showSoftKeyboard } from '../utils/KeyboardUtils';
import Theme from '../utils/Theme';
import { KeyboardIcon, ScanIcon } from './Icons';
import { useScanFlash } from './ScanFlash';

const DUPLICATE_SCAN_WINDOW_MS = 1000;

type ScannerInputProps = {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (value: string) => void;
  label?: string;
  style?: StyleProp<ViewStyle>;
  /**
   * If false, the component stops fighting for focus.
   * Useful if there is a custom non-native modal open.
   */
  isEnabled?: boolean;
  /**
   * Time in milliseconds to wait after the last input before auto-submitting.
   * Set to 0 or null to disable auto-submit.
   */
  autoSubmitTimeout?: number;
  /**
   * Custom left icon component. Defaults to scan icon.
   */
  leftIcon?: React.ReactNode;
  /**
   * If true, shows the keyboard on mount instead of hiding it.
   */
  showKeyboardOnMount?: boolean;
  /**
   * Keyboard type (e.g., 'number-pad', 'default')
   */
  keyboardType?: 'default' | 'number-pad' | 'email-address';
  placeholder?: string;
  /**
   * If true, shows error styling (red border) - uses PaperTextInput error color (#B00020)
   */
  danger?: boolean;
  /**
   * If false, hardware (DataWedge) scans are dropped with a fail flash; typing still works.
   * Use it on fields that are not meant for barcodes, such as quantities. The scan listener
   * stays registered so DataWedge keystroke output stays muted.
   */
  acceptsScans?: boolean;
};

/**
 * @name ScannerInput
 * @description A custom input component for scanning barcodes.
 *
 * This component is designed to work with hardware barcode scanners. It ensures that the input
 * is focused and ready for scanning. It also prevents the on-screen keyboard from appearing.
 * Keyboard visibility is controlled explicitly via a native Android module (KeyboardModule)
 * rather than the unreliable showSoftInputOnFocus prop.
 *
 * IMPORTANT: Ensure there is one scanner input per screen.
 *
 * @example
 * <ScannerInput
 *   value={barcode}
 *   onChange={setBarcode}
 *   label="Scan Barcode"
 *   onSubmit={handleBarcodeSubmit}
 * />
 */
export function ScannerInput({
  value,
  onChange,
  onSubmit,
  label,
  style,
  isEnabled = true,
  autoSubmitTimeout,
  leftIcon,
  showKeyboardOnMount,
  keyboardType,
  placeholder,
  danger = false,
  acceptsScans = true
}: ScannerInputProps) {
  const storedDebounceTime = useSelector((state: RootState) => state.settingsReducer.barcodeScanDebounceTime);
  const defaultTimeout = storedDebounceTime ?? appConfig.DEFAULT_DEBOUNCE_TIME;
  const timeout = autoSubmitTimeout !== undefined ? autoSubmitTimeout : defaultTimeout;
  const inputRef = useRef<NativeTextInput | null>(null);
  const isScreenFocused = useIsFocused();
  const [showKeyboard, setShowKeyboard] = useState(showKeyboardOnMount ?? false);
  const formattedLabel = label && isString(label) ? label.toUpperCase() : 'SCAN BARCODE';

  // Track the latest submitted value to prevent double submissions
  const lastSubmittedValue = useRef<string>('');
  // A repeated scan is a duplicate while the field still shows it, or when it arrives right after the
  // previous one (a double fire). Once a screen has cleared the field, e.g. after a failed lookup, the
  // same code is accepted again, even if React batched the clear with the scan into no visible change.
  const renderedValue = useRef(value);
  renderedValue.current = value;
  const lastScanAt = useRef(0);
  const shouldBeFocused = isScreenFocused && isEnabled;
  // Scans mid-flash are ignored below; disabling the listener would re-enable DataWedge keystrokes.
  const { isFlashing, flash } = useScanFlash();

  // Focus the input — keyboard is handled via onFocus callback
  const requestFocus = useCallback(() => {
    if (!shouldBeFocused) {
      return;
    }
    const input = inputRef.current;
    if (input && !input.isFocused()) {
      input.focus();
    }
  }, [shouldBeFocused]);

  // Focus on mount after navigation transitions complete
  useEffect(() => {
    if (shouldBeFocused) {
      const handle = InteractionManager.runAfterInteractions(requestFocus);
      return () => handle.cancel();
    }
  }, [requestFocus, shouldBeFocused]);

  // Handle app state changes
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (nextAppState === 'active' && shouldBeFocused) {
        requestFocus();
      }
    });
    return () => subscription.remove();
  }, [requestFocus, shouldBeFocused]);

  // Re-focus after hardware scanner dismisses keyboard (scanner mode only)
  useEffect(() => {
    if (!shouldBeFocused || showKeyboard) {
      return;
    }
    const hideSubscription = Keyboard.addListener('keyboardDidHide', requestFocus);
    return () => hideSubscription.remove();
  }, [requestFocus, shouldBeFocused, showKeyboard]);

  // Auto-submit after timeout
  useEffect(() => {
    // An emptied field accepts the same value again, also when auto-submit is off.
    if (!value) {
      lastSubmittedValue.current = '';
      return;
    }

    if (!timeout) {
      return;
    }

    if (value === lastSubmittedValue.current) {
      return;
    }

    const timer = setTimeout(() => {
      const trimmed = value.trim();
      if (trimmed && trimmed !== lastSubmittedValue.current) {
        lastSubmittedValue.current = trimmed;
        onSubmit(trimmed);
      }
    }, timeout);

    return () => clearTimeout(timer);
  }, [value, timeout, onSubmit]);

  useScanListener((result) => {
    const scanned = result.data;
    if (!scanned || isFlashing) {
      return;
    }
    if (!acceptsScans) {
      flash('fail');
      return;
    }
    if (
      scanned === lastSubmittedValue.current &&
      (renderedValue.current.trim() === scanned || Date.now() - lastScanAt.current < DUPLICATE_SCAN_WINDOW_MS)
    ) {
      return;
    }
    lastSubmittedValue.current = scanned;
    lastScanAt.current = Date.now();
    onChange(scanned);
    onSubmit(scanned);
  }, shouldBeFocused);

  const handleFocus = useCallback(() => {
    if (showKeyboard) {
      showSoftKeyboard();
    }
  }, [showKeyboard]);

  const handleBlur = () => {
    if (shouldBeFocused && !showKeyboard) {
      requestFocus();
    }
  };

  const handleChangeText = (text: string) => {
    if (!shouldBeFocused || isFlashing) {
      return;
    }
    onChange(text);
  };

  const handleSubmitEditing = () => {
    if (!shouldBeFocused) {
      return;
    }

    const trimmed = value.trim();
    if (trimmed && trimmed !== lastSubmittedValue.current) {
      lastSubmittedValue.current = trimmed;
      onSubmit(trimmed);
    }

    requestFocus();
  };

  const handleKeyboardPress = () => {
    const newShowKeyboard = !showKeyboard;
    setShowKeyboard(newShowKeyboard);

    if (newShowKeyboard) {
      const input = inputRef.current;
      if (input && !input.isFocused()) {
        input.focus();
      }
      showSoftKeyboard();
    } else {
      hideSoftKeyboard();
    }
  };

  return (
    <PaperTextInput
      ref={inputRef}
      mode="outlined"
      label={formattedLabel}
      value={value}
      style={style}
      showSoftInputOnFocus={showKeyboard}
      autoCorrect={false}
      autoCompleteType="off"
      importantForAutofill="no"
      placeholder={placeholder}
      placeholderTextColor={danger ? Theme.colors.danger : Theme.colors.disabled}
      blurOnSubmit={false}
      returnKeyType="done"
      keyboardType={keyboardType || 'default'}
      error={danger}
      left={
        // @ts-ignore
        <PaperTextInput.Icon
          name={() => leftIcon || <ScanIcon size={24} color={danger ? Theme.colors.danger : undefined} />}
        />
      }
      right={
        // @ts-ignore
        <PaperTextInput.Icon
          name={() => <KeyboardIcon size={24} color={danger ? Theme.colors.danger : undefined} />}
          onPress={handleKeyboardPress}
        />
      }
      onFocus={handleFocus}
      onBlur={handleBlur}
      onChangeText={handleChangeText}
      onSubmitEditing={handleSubmitEditing}
    />
  );
}

ScannerInput.displayName = 'ScannerInput';
