import React from 'react';
import { Image, Text, View } from 'react-native';
import styles from './styles';

const Placeholder = () => {
  return (
    <View style={styles.container}>
      <Image source={require('../../assets/images/picking.png')} />
      <Text style={styles.text}>Coming soon...</Text>
    </View>
  );
};

export default Placeholder;
