import { Dimensions, StatusBar } from 'react-native';

export const device = {
  windowWidth: Dimensions.get('window').width,
  windowHeight: Dimensions.get('window').height,
  screenWidth: Dimensions.get('screen').width,
  screenHeight: Dimensions.get('screen').height,
  statusBarHeight: StatusBar.currentHeight || 0
};

export const ratio = {
  width: Dimensions.get('window').width / 392,
  height: Dimensions.get('window').height / 776
};

export const HYPHEN = '-';
export const EMPTY_FALLBACK = 'Unassigned';
export const EMPTY_STRING = '';
export const INPUT_FOCUS_DELAY_TIME_IN_MS = 500;

export const DEFAULT_DATE_FORMAT_OPTIONS: Intl.DateTimeFormatOptions = {
  year: 'numeric',
  month: 'long',
  day: 'numeric'
};

export const appConfig = {
  DEFAULT_DEBOUNCE_TIME: 100,
  APP_HEADER_HEIGHT: 56,
  LOCALE: 'en-US'
};
