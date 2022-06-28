import { Dimensions } from 'react-native';

export const colors = {
  headerColor: '#003369',
  disabledBgColor: '#cccccc'
};

export const device = {
  windowWidth: Dimensions.get('window').width,
  windowHeight: Dimensions.get('window').height,
  screenWidth: Dimensions.get('screen').width,
  screenHeight: Dimensions.get('screen').height
};

export const ratio = {
  width: Dimensions.get('window').width / 392,
  height: Dimensions.get('window').height / 776
};

export const appHeaderHeight = 55;
