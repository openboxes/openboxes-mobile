import React, {Component} from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import Dashboard from '../screens/Dashboard';
import Products from '../screens/Products';

const Drawer = createDrawerNavigator();

class DrawerNavigator extends Component {
  render() {
    return (
      <Drawer.Navigator>
        <Drawer.Screen name="Dashboard" component={Dashboard} />
        <Drawer.Screen name="Products" component={Products} />
      </Drawer.Navigator>
    );
  }
}

export default DrawerNavigator;
