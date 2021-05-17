import React from 'react';
import Root from "./app/components/screens/Root";
import store from "./app/redux/Store";
import {Provider as ReduxProvider} from "react-redux";
import {Provider as PaperProvider} from "react-native-paper";

export default function App() {
  return (
    <ReduxProvider store={store}>
      <PaperProvider>
        <Root/>
      </PaperProvider>
    </ReduxProvider>
  );
}
