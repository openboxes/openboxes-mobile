import { ReactElement } from 'react';

type LabeledDataProps = {
  label: string;
  value?: string | number | ReactElement | null;
  defaultValue?: string | number;
  style?: any;
} | null;

export type Props = LabeledDataProps;
