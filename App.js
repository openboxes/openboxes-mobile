import React from 'react';
import {GalioProvider} from 'galio-framework';
import {materialTheme} from './app/constants/';
import Root from "./app/components/screens/Root";
import store from "./app/redux/Store";
import {Provider} from "react-redux";

export default function App() {
  return (
    <Provider store={store}>
      <GalioProvider theme={materialTheme}>
        <Root/>
      </GalioProvider>
    </Provider>
  );
}
