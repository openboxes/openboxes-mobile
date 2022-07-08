import React from 'react';
import { View } from 'react-native';
import { Props } from './types';

const ContentHeader: React.FC<Props> = (props) => {
  const { children, ...otherProps } = props;

  return <View {...otherProps}>{children}</View>;
};

export default ContentHeader;
