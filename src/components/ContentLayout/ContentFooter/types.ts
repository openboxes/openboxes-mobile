import { ViewProps } from 'react-native';
import React from 'react';

export interface Props extends ViewProps {
  children: React.ReactNode;
  direction?: 'column' | 'row';
  gap?: number;
  fixed?: boolean;
}
