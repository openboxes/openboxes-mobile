import React from 'react';
import { Text, View } from 'react-native';

import IconEmpty from '../../assets/images/icon_empty.svg';
import styles from './styles';

const Placeholder = () => {
  return (
    <View style={styles.container}>
      <IconEmpty />
      <Text style={styles.text}>Coming soon...</Text>
    </View>
  );
};

export default Placeholder;
