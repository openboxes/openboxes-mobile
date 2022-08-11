import React from 'react';
import { Image, Text, View } from 'react-native';
import { common, typography } from '../../assets/styles';

const Placeholder = () => {
  return (
    <View style={[common.containerCenter, common.flex1]}>
      <Image source={require('../../assets/images/picking.png')} />
      <Text style={[typography.h1, typography.bold, typography.colorSecondary]}>Coming soon...</Text>
    </View>
  );
};

export default Placeholder;
