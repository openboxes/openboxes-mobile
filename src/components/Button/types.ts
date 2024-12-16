import { ViewProps } from 'react-native';

export interface Props extends ViewProps {
  title: string;
  onPress?: () => void;
  disabled?: boolean;
  size?: 'default' | '80%' | '50%' | '100%';
  mode?: 'text' | 'outlined' | 'contained';
}
