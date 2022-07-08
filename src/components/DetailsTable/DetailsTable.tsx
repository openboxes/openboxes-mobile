import React from 'react';
import { View } from 'react-native';
import { Props } from './types';
import LabeledData from '../LabeledData';
import styles, { columnStyle } from './styles';

const DetailsTable: React.FC<Props> = ({ style, data, columns = 2 }) => {
  return (
    <View style={[style, styles.container]}>
      {data.map((dataProps) => (
        <LabeledData key={dataProps.label} style={columnStyle(columns).column} {...dataProps} />
      ))}
    </View>
  );
};

export default DetailsTable;
