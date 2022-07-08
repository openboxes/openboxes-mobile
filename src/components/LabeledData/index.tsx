import React from 'react';
import { Text, View } from 'react-native';
import { Props } from './types';
import styles from './styles';

const LabeledData: React.FC<Props> = ({ style, label, value, defaultValue = '-' }) => {
  return (
    <View style={[style]}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.data}>{value ?? defaultValue}</Text>
    </View>
  );
};

export default LabeledData;
