import React from 'react';
import { View } from 'react-native';
import { Props } from './types';
import styles, { gapStyle } from './styles';
import AddPropsToChildren from '../../../utils/AddPropsToChildren';

const ContentFooter: React.FC<Props> = (props) => {
  const { children, direction = 'row', gap = 0, ...otherProps } = props;

  let gapStyleGap = {};
  let gapStyleContainer = {};
  if (gap > 0) {
    const gapStyles = gapStyle({ gap });
    gapStyleGap = gapStyles.gap;
    gapStyleContainer = gapStyles.container;
  }

  const directionStyle = direction === 'row' ? styles.directionRow : styles.directionColumn;

  const childrenWithProps = AddPropsToChildren(children, (child) => {
    const childStyles = Array.isArray(child.props.style)
      ? [...child.props.style, gapStyleGap]
      : { ...child.props.style, ...gapStyleGap };
    return { style: childStyles };
  });

  return (
    <View style={[styles.container, gapStyleContainer, directionStyle]} {...otherProps}>
      {childrenWithProps}
    </View>
  );
};

export default ContentFooter;
