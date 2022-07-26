/* eslint-disable react-native/no-inline-styles */
import React, { Component } from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import ChooseCurrentLocation from './ChooseCurrentLocation';
import Dashboard from './Dashboard';
import { Image } from 'react-native';
import { appHeaderHeight } from '../constants';
import { colors } from '../assets/styles';

const Drawer = createDrawerNavigator();

class DrawerNavigator extends Component {
  render() {
    return (
      <Drawer.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: colors.accent,
            height: appHeaderHeight
          },
          headerTitleStyle: {
            color: colors.white
          },
          headerTintColor: colors.white,
          headerRight: () => (
            <Image
              source={require('../assets/images/logo.png')}
              style={{
                resizeMode: 'stretch',
                width: 40,
                height: 30,
                marginRight: 30
              }}
            />
          )
        }}
      >
        <Drawer.Screen name="Choose Location" component={ChooseCurrentLocation} />
        <Drawer.Screen name="Dashboard" component={Dashboard} />
      </Drawer.Navigator>
    );
  }
}

export default DrawerNavigator;
