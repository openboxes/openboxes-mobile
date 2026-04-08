import { Keyboard, NativeModules, Platform } from 'react-native';

const { KeyboardModule } = NativeModules;

/**
 * Reliably shows the soft keyboard on Android by calling
 * InputMethodManager.showSoftInput() directly via a native module.
 *
 * This bypasses the unreliable showSoftInputOnFocus prop behavior
 * where focus() succeeds but the keyboard doesn't appear during
 * navigation transitions.
 *
 * On iOS this is a no-op — focus() reliably shows the keyboard.
 */
export function showSoftKeyboard(): void {
  if (Platform.OS === 'android' && KeyboardModule) {
    KeyboardModule.showKeyboard();
  }
}

export function hideSoftKeyboard(): void {
  if (Platform.OS === 'android' && KeyboardModule) {
    KeyboardModule.hideKeyboard();
  } else {
    Keyboard.dismiss();
  }
}
