import React from 'react';
import { Text, View } from 'react-native';
import { Props } from './types';
import styles from './styles';

const LabeledData: React.FC<Props> = ({ style, labelStyle, valueStyle, label, value, defaultValue = '-' }) => {
  return (
    <View style={[style]}>
      <Text style={[styles.label, labelStyle]}>{label}</Text>
      <Text style={[styles.data, valueStyle]}>{value ?? defaultValue}</Text>
    </View>
  );
};

export default LabeledData;
