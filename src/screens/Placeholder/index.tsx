import React from 'react';
import { Text, View } from 'react-native';

import IconEmpty from '../../assets/images/icon_empty.svg';
import Theme from '../../utils/Theme';
import styles from './styles';

const Placeholder = () => {
  return (
    <View style={styles.container}>
      <IconEmpty fill={Theme.colors.primary} />
      <Text style={styles.text}>Coming soon...</Text>
    </View>
  );
};

export default Placeholder;
