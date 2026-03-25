import { useIsFocused } from '@react-navigation/native';
import React, { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react';
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
import { RootState } from '../redux/reducers';
import Theme from '../utils/Theme';
import { KeyboardIcon, ScanIcon } from './Icons';

const POST_TRANSITION_FOCUS_DELAY = 300;

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
};

/**
 * @name ScannerInput
 * @description A custom input component for scanning barcodes.
 *
 * This component is designed to work with hardware barcode scanners. It ensures that the input
 * is focused and ready for scanning. It also prevents the on-screen keyboard from appearing.
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
export const ScannerInput = forwardRef<NativeTextInput, ScannerInputProps>(
  (
    {
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
      danger = false
    },
    ref
  ) => {
    const storedDebounceTime = useSelector((state: RootState) => state.settingsReducer.barcodeScanDebounceTime);
    const defaultTimeout = storedDebounceTime ?? appConfig.DEFAULT_DEBOUNCE_TIME;
    const timeout = autoSubmitTimeout !== undefined ? autoSubmitTimeout : defaultTimeout;
    const internalInputRef = useRef<NativeTextInput | null>(null);
    const isScreenFocused = useIsFocused();
    const [showKeyboard, setShowKeyboard] = useState(showKeyboardOnMount ?? false);
    const formattedLabel = label && isString(label) ? label.toUpperCase() : 'SCAN BARCODE';

    // Track the latest submitted value to prevent double submissions
    const lastSubmittedValue = useRef<string>('');
    const shouldBeFocused = isScreenFocused && isEnabled;

    useImperativeHandle(ref, () => internalInputRef.current!);

    // Simple focus - just focus without all the complex logic
    const requestFocus = useCallback(() => {
      if (!shouldBeFocused) {
        return;
      }
      const input = internalInputRef.current;
      if (input && !input.isFocused()) {
        input.focus();
      }
    }, [shouldBeFocused]);

    // Focus once on mount if the screen is focused, and whenever focus state changes
    // Wait for navigation/animation transitions to complete, then delay slightly
    // to ensure the native view has fully laid out before requesting focus
    useEffect(() => {
      if (shouldBeFocused) {
        const handle = InteractionManager.runAfterInteractions(() => {
          setTimeout(requestFocus, POST_TRANSITION_FOCUS_DELAY);
        });
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

    // Keyboard Dismissal (Hardware scanner often hides soft keyboard)
    useEffect(() => {
      if (!shouldBeFocused) {
        return;
      }
      const hideSubscription = Keyboard.addListener('keyboardDidHide', requestFocus);
      return () => hideSubscription.remove();
    }, [requestFocus, shouldBeFocused]);

    // Auto-submit after timeout
    useEffect(() => {
      // Don't auto-submit if disabled
      if (!timeout) {
        return;
      }

      // If the input is empty, reset last submitted value tracker
      if (!value) {
        lastSubmittedValue.current = '';
        return;
      }

      // If the current value matches what we just submitted, don't trigger the timer again.
      // This handles cases where parent component might not clear the input immediately after submit.
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

    const handleBlur = () => {
      if (shouldBeFocused) {
        requestFocus();
      }
    };

    const handleChangeText = (text: string) => {
      if (!shouldBeFocused) {
        return;
      }
      onChange(text);
    };

    const handleSubmitEditing = () => {
      if (!shouldBeFocused) {
        return;
      }

      const trimmed = value.trim();
      if (trimmed) {
        lastSubmittedValue.current = trimmed;
        onSubmit(trimmed);
      }

      requestFocus();
    };

    const handleKeyboardPress = () => {
      setShowKeyboard((prevState) => {
        const newShowKeyboard = !prevState;

        if (newShowKeyboard) {
          // Opening keyboard: blur and refocus to trigger showSoftInputOnFocus
          // Add safety check here just in case ref was nulled out
          const input = internalInputRef.current;
          if (input) {
            input.blur();
            input.focus();
          }
        } else {
          // Closing keyboard: just dismiss it
          Keyboard.dismiss();
        }

        return newShowKeyboard;
      });
    };

    return (
      <PaperTextInput
        ref={internalInputRef}
        mode="outlined"
        label={formattedLabel}
        value={value}
        style={style}
        // Keep keyboard hidden
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
        onBlur={handleBlur}
        onFocus={() => {}}
        onChangeText={handleChangeText}
        onSubmitEditing={handleSubmitEditing}
      />
    );
  }
);

ScannerInput.displayName = 'ScannerInput';
