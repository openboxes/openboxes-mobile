import { StyleSheet } from 'react-native';
import { device, appHeaderHeight } from '../../../constants';

const containerMargin = 10;

export default StyleSheet.create({
  container: {
    margin: containerMargin,
    display: 'flex',
    flexDirection: 'column',
    minHeight: device.windowHeight - appHeaderHeight - 2 * containerMargin
  }
});
