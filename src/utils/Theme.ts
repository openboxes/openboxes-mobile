import { DefaultTheme } from 'react-native-paper';

// Set by scripts/apply_branding.sh from the brand's primary_color; keep on one line.
export const brandPrimaryColor: string | null = null;

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
    primary: brandPrimaryColor ?? '#20345c',
    secondaryBackground: '#e9ecef',
    secondaryForeground: '#495057',
    danger: '#B00020',
    successForeground: '#1F9D6B',
    successBackground: '#E6F5EE',
    infoForeground: '#5B6AD0',
    infoBackground: '#EEF0FB',
    warningForeground: '#8A6D3B',
    warningBackground: '#FBEAD0'
  },
  spacing: {
    small: 8,
    medium: 12,
    large: 16
  }
};
