import React from 'react';
import { View } from 'react-native';
import { Divider } from 'react-native-paper';

import AddPropsToChildren from '../../../utils/AddPropsToChildren';
import styles, { gapStyle } from './styles';
import { Props } from './types';

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
    <>
      <Divider />
      <View style={[styles.container, gapStyleContainer, directionStyle]} {...otherProps}>
        {childrenWithProps}
      </View>
    </>
  );
};

export default ContentFooter;
