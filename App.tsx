import React, {Component} from 'react';
import {Provider} from 'react-redux';
// import logger from 'redux-logger';
import {createStore, applyMiddleware} from 'redux';
import createSageMiddleware from 'redux-saga';
import rootRducer from './src/redux/reducers';
import watchers from './src/redux/sagas';
import Main from './src/Main';

const saga = createSageMiddleware();

const store = createStore(rootRducer, applyMiddleware(saga));

saga.run(watchers);

export default class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Main />
      </Provider>
    );
  }
}
