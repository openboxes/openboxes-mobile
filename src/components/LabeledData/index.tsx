import React from 'react';
import { Text, View } from 'react-native';
import { Props } from './types';
import { typography } from '../../assets/styles';

const LabeledData: React.FC<Props> = ({ style, labelStyle, valueStyle, label, value, defaultValue = '-' }) => {
  return (
    <View style={[style]}>
      <Text style={[typography.label, labelStyle]}>{label}</Text>
      <Text style={[typography.value, valueStyle]}>{value ?? defaultValue}</Text>
    </View>
  );
};

export default LabeledData;
