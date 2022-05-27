/* eslint-disable react-native/no-inline-styles */
import React, { Component } from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import ChooseCurrentLocation from './ChooseCurrentLocation';
import { Image } from 'react-native';
import { colors } from '../constants';

const Drawer = createDrawerNavigator();

class DrawerNavigator extends Component {
  render() {
    return (
      <Drawer.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: colors.headerColor
          },
          headerTitleStyle: {
            color: 'white'
          },
          headerTintColor: '#ffffff',
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
        <Drawer.Screen
          name="Choose Current Location"
          component={ChooseCurrentLocation}
        />
      </Drawer.Navigator>
    );
  }
}

export default DrawerNavigator;
