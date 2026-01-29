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

import IconKeyboard from '../assets/images/icon_keyboard.svg';
import IconScanAction from '../assets/images/icon_scan_action.svg';
import { appConfig } from '../constants';

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
   * @default appConfig.DEFAULT_DEBOUNCE_TIME
   */
  autoSubmitTimeout?: number;
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
      label = 'Scan Barcode',
      style,
      isEnabled = true,
      autoSubmitTimeout = appConfig.DEFAULT_DEBOUNCE_TIME
    },
    ref
  ) => {
    const internalInputRef = useRef<NativeTextInput | null>(null);
    const isScreenFocused = useIsFocused();
    const [showKeyboard, setShowKeyboard] = useState(false);

    // Track the latest submitted value to prevent double submissions (one from debounce, one from Enter key)
    const lastSubmittedValue = useRef<string>('');

    // We only want to be aggressive about focus if the screen is visible
    // AND the parent component hasn't explicitly disabled us.
    const shouldBeFocused = isScreenFocused && isEnabled;

    useImperativeHandle(ref, () => internalInputRef.current!);

    const requestFocus = useCallback(() => {
      if (!shouldBeFocused) {
        return;
      }

      InteractionManager.runAfterInteractions(() => {
        const input = internalInputRef.current;
        // Check if already focused to avoid UI flicker
        if (input && !input.isFocused()) {
          input.focus();
        }
      });
    }, [shouldBeFocused]);

    // Initial Load & Reacting to Navigation/Prop changes
    useEffect(() => {
      if (shouldBeFocused) {
        requestFocus();
      } else {
        internalInputRef.current?.blur();
        // Reset keyboard state when screen loses focus
        setShowKeyboard(false);
      }
    }, [requestFocus, shouldBeFocused]);

    // App State (Background/Foreground)
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
      if (!autoSubmitTimeout) {
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
      }, autoSubmitTimeout);

      return () => clearTimeout(timer);
    }, [value, autoSubmitTimeout, onSubmit]);

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
        label={label}
        value={value}
        style={style}
        // Keep keyboard hidden
        showSoftInputOnFocus={showKeyboard}
        autoCorrect={false}
        autoCompleteType="off"
        importantForAutofill="no"
        blurOnSubmit={false}
        returnKeyType="done"
        // @ts-ignore
        left={<PaperTextInput.Icon name={() => <IconScanAction height={24} width={24} />} />}
        right={
          // @ts-ignore
          <PaperTextInput.Icon name={() => <IconKeyboard height={24} width={24} />} onPress={handleKeyboardPress} />
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
