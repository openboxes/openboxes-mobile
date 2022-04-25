import { ImageSourcePropType } from 'react-native';

export interface OwnProps {
  label: String | null;
  placeholder?: String | null;
  icon?: ImageSourcePropType;
  showSelect?: boolean;
  refs?: any;
  value?: string | any;
  onChange?: any;
  disabled?: boolean;
  keyboard?: any;
  editable?: boolean;
  onEndEdit?: (text: string) => void;
  onIconClick?: () => void;
  style?: any;
  data?: any;
}

export interface StateProps {}

export interface DispatchProps {}

export type Props = OwnProps & StateProps & DispatchProps;
