import React, { FC } from 'react';
import { View, Text, Image } from 'react-native';
import Styles from './Styles';
import DeviceInfo from 'react-native-device-info';
import Config from 'react-native-config';

const AppInfoScreen: FC = () => {
  return (
    <View style={Styles.mainContainer}>
      <Text style={Styles.openboxTextStyle}>Openboxes</Text>
      <Text style={Styles.versionNumberText}>
        Version number:{' '}
        {Config?.BUILD_NUMBER ? Config?.BUILD_NUMBER : DeviceInfo.getVersion()}{' '}
      </Text>
      <Image
        source={require('../../assets/images/logo.png')}
        resizeMode={'cover'}
        style={Styles.imageStyle}
      />
      <Text style={Styles.certificateText}>2010-2022 Openboxes inc.</Text>
    </View>
  );
};

export default AppInfoScreen;
