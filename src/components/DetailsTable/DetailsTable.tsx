import React from 'react';
import { View } from 'react-native';
import { Props } from './types';
import LabeledData from '../LabeledData';
import styles, { columnStyle } from './styles';

const DetailsTable: React.FC<Props> = ({ data, columns = 2 }) => {
  return (
    <View style={styles.container}>
      {data.map((dataProps) => (
        <View key={dataProps.label} style={columnStyle(columns).column}>
          <LabeledData {...dataProps} />
        </View>
      ))}
    </View>
  );
};

export default DetailsTable;
