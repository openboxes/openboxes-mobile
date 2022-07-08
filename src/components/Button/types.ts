import { ViewProps } from 'react-native';

export type ButtonSizeType = 'default' | '80%' | '50%';

export interface Props extends ViewProps {
  title: string;
  onPress?: () => void;
  disabled?: boolean;
  size?: ButtonSizeType;
}
