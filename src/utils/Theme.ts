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
    primary: '#0052CC',
    warning: '#FCFFC1',
    danger: '#FF5630',
    success: '#22bb33',
    info: '#00B8D9'
  }
};
