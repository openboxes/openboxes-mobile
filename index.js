import 'react-native-gesture-handler';
import 'react-native-reanimated';

import { AppRegistry, LogBox } from 'react-native';
import App from './App';
import { name as appName } from './app.json';

LogBox.ignoreAllLogs(true);
AppRegistry.registerComponent(appName, () => App);
