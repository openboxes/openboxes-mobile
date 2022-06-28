import React from 'react';
import { View, ScrollView } from 'react-native';
import { Props } from './types';
import styles from './styles';

const ContentContainer: React.FC<Props> = (props) => {
  const { children, style, scroll = true, ...otherProps } = props;

  const ContainerComponent = scroll ? ScrollView : View;

  return (
    <ContainerComponent {...otherProps}>
      <View style={[style, styles.container]}>{children}</View>
    </ContainerComponent>
  );
};

export default ContentContainer;
