/**
 * Older versions of @types/react-native don't include hasTVPreferredFocus and tvParallaxProperties
 * on TouchableWithoutFeedbackProps, but react-native-paper v4 passes these
 * TV/Apple TV-related props through, causing TypeScript compilation errors.
 * Without this, some UI primitives that need those props to be passed will fail to compile,
 * even though the props are mostly relevant for TV platforms.
 * This file patches the type definitions to suppress those errors.
 */
import 'react-native';

declare module 'react-native' {
  interface TouchableWithoutFeedbackProps {
    hasTVPreferredFocus?: boolean;
    tvParallaxProperties?: object;
  }
}
