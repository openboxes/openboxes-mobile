import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import Theme from '../utils/Theme';

const RenderData = ({ title, subText }: any): JSX.Element => {
  return (
    <View style={styles.columnItem}>
      <Text style={styles.label}>{title}</Text>
      <Text style={styles.value}>{subText}</Text>
    </View>
  );
};

export default RenderData;

const styles = StyleSheet.create({
  columnItem: {
    display: 'flex',
    flexDirection: 'column',
    flex: 0,
    width: '50%'
  },
  label: {
    fontSize: 12,
    color: Theme.colors.placeholder
  },
  value: {
    fontSize: 16,
    color: Theme.colors.text,
    width: '90%'
  }
});
