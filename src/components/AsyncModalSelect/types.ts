export interface OwnProps {
  label: string;
  initialData: any,
  initValue: string,
  searchAction: Function,
  searchActionParams?: any,
  placeholder?: string
  onSelect?: Function,
  getMoreData?: Function,
  showSelect?: boolean;
  value?: string | any;
  onChange?: (text: string) => void;
  disabled?: boolean;
  keyboard?: any;
  editable?: boolean;
  onEndEdit?: (text: string) => void;
}

export type Props = OwnProps;
