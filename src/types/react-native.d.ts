import 'react-native';

declare module 'react-native' {
  interface TouchableWithoutFeedbackProps {
    hasTVPreferredFocus?: boolean;
    tvParallaxProperties?: object;
  }
}
