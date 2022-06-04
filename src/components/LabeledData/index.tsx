import React from 'react';
import { Text, View } from 'react-native';
import { Props } from './types';
import styles from './styles';

const LabeledData: React.FC<Props> = ({ label, data, defaultValue = '-' }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.data}>{data ?? defaultValue}</Text>
    </View>
  );
};

export default LabeledData;
