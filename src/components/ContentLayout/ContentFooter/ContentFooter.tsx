import React from 'react';
import { View } from 'react-native';
import { Props } from './types';
import styles from './styles';
import AddPropsToChildren from '../../../utils/AddPropsToChildren';

const ContentHeader: React.FC<Props> = (props) => {
  const { children, direction = 'row', ...otherProps } = props;

  const directionStyle = direction === 'row' ? styles.directionRow : styles.directionColumn;

  const childrenWithProps = AddPropsToChildren(children, (child) => {
    const childStyles = Array.isArray(child.props.style)
      ? [...child.props.style, styles.gap]
      : { ...child.props.style, ...styles.gap };
    return { style: childStyles };
  });

  return (
    <View style={[styles.container, directionStyle]} {...otherProps}>
      {childrenWithProps}
    </View>
  );
};

export default ContentHeader;
