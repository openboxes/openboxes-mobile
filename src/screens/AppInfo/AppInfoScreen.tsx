import React from 'react';
import { View, Text, Image } from 'react-native';
import styles from './styles';
import { common, typography } from '../../assets/styles';
import DeviceInfo from 'react-native-device-info';
import { BUILD_NUMBER } from '@env';

const AppInfoScreen: React.FC = () => {
  return (
    <View style={[common.containerCenter, common.flex1]}>
      <Text style={typography.h1}>Openboxes</Text>
      <Text style={[typography.p3, typography.colorPrimary]}>Version Number: {DeviceInfo.getVersion()}</Text>
      <Text style={[typography.p3, typography.colorPrimary]}>Build Number: {BUILD_NUMBER || 'Development'}</Text>
      <Image source={require('../../assets/images/logo.png')} resizeMode={'cover'} style={styles.imageStyle} />
      <Text style={[typography.p2, typography.colorPrimary]}>2010-2022 Openboxes inc.</Text>
    </View>
  );
};

export default AppInfoScreen;
