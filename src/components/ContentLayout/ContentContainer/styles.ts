import { StyleSheet } from 'react-native';
import { device, appHeaderHeight } from '../../../constants';

const constainerMargin = 10;

export default StyleSheet.create({
  container: {
    margin: constainerMargin,
    display: 'flex',
    flexDirection: 'column',
    minHeight: device.windowHeight - appHeaderHeight - 2 * constainerMargin
  }
});
