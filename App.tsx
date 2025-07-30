/* eslint-disable react-native/no-inline-styles */
import { DSN_KEY } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Sentry from '@sentry/react-native';
import React, { Component } from 'react';
import { StatusBar } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Provider } from 'react-redux';
import { applyMiddleware, createStore } from 'redux';
import { persistReducer, persistStore } from 'redux-persist';
import { PersistGate } from 'redux-persist/integration/react';
import createSagaMiddleware from 'redux-saga';

import Main from './src/Main';
import rootReducer from './src/redux/reducers';
import watchers from './src/redux/sagas';

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['settingsReducer']
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const saga = createSagaMiddleware();
export const store = createStore(persistedReducer, applyMiddleware(saga));
export const persistor = persistStore(store);
saga.run(watchers);

Sentry.init({
  dsn: DSN_KEY
});

export class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <PersistGate loading={null} persistor={persistor}>
            <StatusBar hidden={false} barStyle="light-content" />
            <Main />
          </PersistGate>
        </GestureHandlerRootView>
      </Provider>
    );
  }
}
export default Sentry.wrap(App);
