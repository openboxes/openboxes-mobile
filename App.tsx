import React, {Component} from 'react';
import {Provider} from 'react-redux';
// import logger from 'redux-logger';
import {createStore, applyMiddleware} from 'redux';
import createSageMiddleware from 'redux-saga';
import rootRducer from './src/redux/reducers';
import watchers from './src/redux/sagas';
import Main from './src/Main';
import {StatusBar} from 'react-native';
import {colors} from './src/constants';

const saga = createSageMiddleware();

export const store = createStore(rootRducer, applyMiddleware(saga));

saga.run(watchers);

export default class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <StatusBar
          backgroundColor={colors.headerColor}
          hidden={false}
          barStyle="light-content"
        />
        <Main />
      </Provider>
    );
  }
}
