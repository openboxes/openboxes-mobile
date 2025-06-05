import { BUILD_NUMBER } from '@env';
import React, { FC } from 'react';
import { Image, Text, View } from 'react-native';

import DeviceInfo from 'react-native-device-info';
import Styles from './Styles';

const AppInfoScreen: FC = () => {
  return (
    <View style={Styles.mainContainer}>
      <Text style={Styles.openboxTextStyle}>Openboxes</Text>
      <Text style={Styles.versionNumberText}>Version Number: {DeviceInfo.getVersion()}</Text>
      <Text style={Styles.versionNumberText}>Build Number: {BUILD_NUMBER || 'Development'}</Text>
      <Image source={require('../../assets/images/logo.png')} style={Styles.logo} resizeMode="contain" />
      <Text style={Styles.certificateText}>2010-2022 Openboxes inc.</Text>
    </View>
  );
};

export default AppInfoScreen;
