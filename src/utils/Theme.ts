import { DefaultTheme } from 'react-native-paper';

export default {
  ...DefaultTheme,
  fonts: {
    ...DefaultTheme.fonts,
    regular: {
      ...DefaultTheme.fonts.regular,
      fontSize: 16
    }
  },
  colors: {
    ...DefaultTheme.colors,
    primary: '#20345c',
    secondaryBackground: '#e9ecef',
    secondaryForeground: '#495057',
    warning: '#FCFFC1',
    warningText: '#8a6d3b',
    danger: '#B00020',
    success: '#22bb33',
    info: '#00B8D9'
  },
  spacing: {
    small: 8,
    medium: 12,
    large: 16
  }
};
