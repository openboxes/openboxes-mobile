import { ViewProps } from 'react-native';
import { IconSource } from 'react-native-paper/lib/typescript/components/Icon';

export interface Props extends ViewProps {
  title: string;
  onPress?: () => void;
  color?: string;
  disabled?: boolean;
  size?: 'default' | '80%' | '50%' | '90%' | '100%';
  mode?: 'text' | 'outlined' | 'contained';
  variant?: 'default' | 'danger' | 'secondary';
  icon?: IconSource | undefined;
}
