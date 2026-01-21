import { useIsFocused } from '@react-navigation/native';
import * as React from 'react';
import { TextInput } from 'react-native';
import { INPUT_FOCUS_DELAY_TIME_IN_MS } from '../constants';

export function useInputFocus(inputRef: React.RefObject<TextInput>, callback?: () => void) {
  const isFocused = useIsFocused();

  React.useEffect(() => {
    if (!isFocused) {
      return;
    }

    callback?.();

    const t = setTimeout(() => inputRef.current?.focus(), INPUT_FOCUS_DELAY_TIME_IN_MS);
    return () => clearTimeout(t);
  }, [isFocused, inputRef, callback]);
}
