import React, {Component} from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import ChooseCurrentLocation from "./ChooseCurrentLocation";
import {Image} from 'react-native'
import {colors} from "../constants";
import InternalTransfer from "./InternalTransfer";

const Drawer = createDrawerNavigator();

class DrawerNavigator extends Component {
    render() {
        return (
            <Drawer.Navigator screenOptions={{
                headerStyle: {
                    backgroundColor: colors.headerColor
                },
                headerRight: () => <Image
                    source={require('../assets/images/logo.png')}
                    style={{resizeMode: 'stretch', width: 40, height: 30, marginRight: 30}}
                />
            }}>
                <Drawer.Screen
                    name="ChooseCurrentLocation"
                    component={ChooseCurrentLocation}
                    options={{
                        // headerStyle: {
                        //     backgroundColor: '#f4511e',
                        // }
                    }}
                />
                <Drawer.Screen
                    name="Internal Transfer"
                    component={InternalTransfer}
                    options={{
                        // headerStyle: {
                        //     backgroundColor: '#f4511e',
                        // }
                    }}
                />
            </Drawer.Navigator>
        );
    }
}

export default DrawerNavigator;
