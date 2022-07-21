import { ReactElement } from 'react';

interface LabeledDataProps {
  label: string;
  value?: string | number | ReactElement | null;
  defaultValue?: string | number;
  style?: any;
  labelStyle?: any;
  valueStyle?: any;
}

export type Props = LabeledDataProps;
