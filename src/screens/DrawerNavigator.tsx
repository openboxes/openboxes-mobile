/* eslint-disable react-native/no-inline-styles */
import { createDrawerNavigator } from '@react-navigation/drawer';
import React from 'react';
import { Image } from 'react-native';
import CustomDrawerContent from '../components/CustomDrawerContent/CustomDrawerContent';
import { appHeaderHeight } from '../constants';
import Theme from '../utils/Theme';
import ChooseCurrentLocation from './ChooseCurrentLocation';
import Dashboard from './Dashboard';

const Drawer = createDrawerNavigator();

const DrawerNavigator = () => {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerStyle: {
          backgroundColor: Theme.colors.primary,
          height: appHeaderHeight
        },
        headerTitleStyle: {
          color: Theme.colors.surface
        },
        drawerActiveTintColor: Theme.colors.primary,
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
        name="Choose Location"
        component={ChooseCurrentLocation}
        options={{
          headerLeft: () => null
        }}
      />
      <Drawer.Screen name="Dashboard" component={Dashboard} />
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;
