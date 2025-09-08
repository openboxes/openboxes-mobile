import { createDrawerNavigator } from '@react-navigation/drawer';
import React from 'react';
import CustomDrawerContent from '../components/CustomDrawerContent/CustomDrawerContent';
import { appConfig } from '../constants';
import Theme from '../utils/Theme';
import ChooseCurrentLocation from './ChooseCurrentLocation';
import Dashboard from './Dashboard';
import HeaderRight from './TopBar/RightHeader';

const Drawer = createDrawerNavigator();

const DrawerNavigator = () => {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={({ route, navigation }) => ({
        headerStyle: {
          backgroundColor: Theme.colors.primary,
          height: appConfig.APP_HEADER_HEIGHT
        },
        headerTitleStyle: {
          color: Theme.colors.surface
        },
        drawerActiveTintColor: Theme.colors.primary,
        headerTintColor: '#ffffff',
        headerRight: () => <HeaderRight route={route} navigation={navigation} />,
      })}
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
