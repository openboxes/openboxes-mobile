import React from 'react';
import Root from "./app/components/screens/Root";
import store from "./app/redux/Store";
import {Provider as ReduxProvider} from "react-redux";
import {Provider as PaperProvider} from "react-native-paper";
import Theme from "./app/utils/Theme";

export default function App() {
  return (
    <ReduxProvider store={store}>
      <PaperProvider theme={Theme}>
        <Root/>
      </PaperProvider>
    </ReduxProvider>
  );
}
