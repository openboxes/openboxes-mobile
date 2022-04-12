export interface OwnProps {
  label: string;
  showSelect?: boolean;
  refs?: any;
  value?: string | any;
  onChange?: (text: string) => void;
  disabled?: boolean;
  keyboard?: any;
  editable?: boolean;
  onEndEdit?: (text: string) => void;
  data: Array<any>;
  selectedData?: Function,
  initValue: string,
  placeholder: string
}

export interface StateProps {}

export interface DispatchProps {}

export type Props = OwnProps & StateProps & DispatchProps;
