import _ from 'lodash';
import React from 'react';
import { ScrollView, View } from 'react-native';
import { Divider } from 'react-native-paper';

import { ContentBody, ContentFooter, ContentHeader } from '../index';
import styles from './styles';
import { Props } from './types';

const ContentContainer: React.FC<Props> = (props) => {
  const { children, style, ...otherProps } = props;

  const arrayChildren = React.Children.toArray(children) as React.ReactElement[];
  const header = _.find(arrayChildren, (child) => _.get(child, 'type.name') === ContentHeader.name);
  const body = _.find(arrayChildren, (child) => _.get(child, 'type.name') === ContentBody.name);
  const footer = _.find(arrayChildren, (child) => _.get(child, 'type.name') === ContentFooter.name);

  return (
    <View {...otherProps} style={[style, styles.container]}>
      {header?.props?.fixed ? header : null}
      <ScrollView contentContainerStyle={styles.scrollContentContainer}>
        {header?.props?.fixed ? null : header}
        {body}
        {footer?.props?.fixed ? null : footer}
      </ScrollView>
      <Divider />
      {footer?.props?.fixed ? footer : null}
    </View>
  );
};

export default ContentContainer;
