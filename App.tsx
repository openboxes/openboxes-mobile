import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import createSageMiddleware from 'redux-saga';
import rootRducer from './src/redux/reducers';
import watchers from './src/redux/sagas';
import Main from './src/Main';
import { StatusBar } from 'react-native';
import { colors } from './src/assets/styles';
import * as Sentry from '@sentry/react-native';
import { DSN_KEY } from '@env';

const saga = createSageMiddleware();
export const store = createStore(rootRducer, applyMiddleware(saga));
saga.run(watchers);

Sentry.init({
  dsn: DSN_KEY
});
export class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <StatusBar
          backgroundColor={colors.accent}
          hidden={false}
          barStyle="light-content"
        />
        <Main />
      </Provider>
    );
  }
}
export default Sentry.wrap(App);
