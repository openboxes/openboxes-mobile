import React from 'react';
import { View } from 'react-native';
import { Props } from './types';
import styles from './styles';

const ContentBody: React.FC<Props> = (props) => {
  const { children, ...otherProps } = props;

  return (
    <View {...otherProps} style={styles.container}>
      {children}
    </View>
  );
};

export default ContentBody;
