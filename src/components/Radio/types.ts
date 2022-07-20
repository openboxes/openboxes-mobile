export interface Props {
  title: string;
  checked: boolean;
  setChecked: (state: boolean) => void;
  disabled?: boolean;
}
