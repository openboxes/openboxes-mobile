import { BUILD_NUMBER } from '@env';
import React from 'react';
import { StyleProp, StyleSheet, Text, TextStyle } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import Theme from '../utils/Theme';

type BuildInfoLabelProps = {
  style?: StyleProp<TextStyle>;
};

const BuildInfoLabel = ({ style }: BuildInfoLabelProps) => {
  const version = DeviceInfo.getVersion();
  const build = BUILD_NUMBER || 'Development';

  return (
    <Text style={[styles.label, style]}>
      OpenBoxes {version} (Build: {build})
    </Text>
  );
};

const styles = StyleSheet.create({
  label: {
    fontSize: 12,
    color: Theme.colors.placeholder,
    textAlign: 'center',
    paddingVertical: Theme.spacing.small
  }
});

export default BuildInfoLabel;
