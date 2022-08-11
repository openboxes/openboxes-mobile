import { Props as LabeledDataProps } from '../LabeledData/types';

export interface Props {
  data: LabeledDataProps[];
  columns?: number;
  gap?: number;
  style?: any;
  entryStyle?: any;
}
