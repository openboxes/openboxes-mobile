import React from 'react';
import {GalioProvider} from 'galio-framework';
import {materialTheme} from './app/constants/';
import {enableScreens} from 'react-native-screens';
import {NavigationContainer} from '@react-navigation/native';
import Root from "./app/components/screens/Root";
import store from "./app/redux/Store";
import { Provider } from "react-redux";

/*
Why we need to call this here has been explained below:

https://github.com/software-mansion/react-native-screens#usage-with-react-navigation
*/
enableScreens();

export default function App() {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <GalioProvider theme={materialTheme}>
          <Root/>
        </GalioProvider>
      </NavigationContainer>
    </Provider>
  );
}
