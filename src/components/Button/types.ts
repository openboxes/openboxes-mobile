import { ViewProps } from 'react-native';

export interface Props extends ViewProps {
  title: string;
  onPress?: () => void;
  color?: string;
  disabled?: boolean;
  size?: 'default' | '80%' | '50%' | '90%' | '100%';
  mode?: 'text' | 'outlined' | 'contained';
}
