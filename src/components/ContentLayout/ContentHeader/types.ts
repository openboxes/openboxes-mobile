import { ViewProps } from 'react-native';
import React from 'react';

export interface Props extends ViewProps {
  children: React.ReactNode;
  fixed?: boolean;
}
