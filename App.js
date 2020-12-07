import React from 'react';
import { Platform, StatusBar, Image } from 'react-native';
import { AppLoading } from 'expo';
import { Asset } from 'expo-asset';
import { Block, GalioProvider, Text } from 'galio-framework';

import { Images, products, materialTheme } from './app/constants/';

import { NavigationContainer } from '@react-navigation/native';
import Screens from './app/navigation/Screens';

// Before rendering any navigation stack
import { enableScreens } from 'react-native-screens';
enableScreens();

//import { useDimensions, useDeviceOrientation } from '@react-native-community/hooks'
//import WelcomeScreen from './app/screens/WelcomeScreen';

export default function App() {
  return (
    <NavigationContainer>
      <GalioProvider theme={materialTheme}>
        <Block flex>
          {Platform.OS === 'ios' && <StatusBar barStyle="default" />}
          <Screens />
        </Block>
      </GalioProvider>
    </NavigationContainer>
  );
}

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     alignItems: 'center',
//     justifyContent: 'center',
//     paddingTop: Platform.OS === "android" ? StatusBar.height : 0
//   },
// });
