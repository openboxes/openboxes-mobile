import {StyleSheet} from 'react-native';
import {device} from '../../../constants';

export default StyleSheet.create({
  mainView: {
    flex: 1,
    justifyContent: 'center'
  },
  image: {
    height: device.screenHeight / 2,
    width: '100%',
    resizeMode: 'contain'
  },
  closeImage: {
      height: 30,
      width: 30
  },
  wrapper: {},
  procuctView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
   },
   closeView: {
    alignItems: 'flex-end', 
    marginBottom: 10
   },
   swiperView: {
    flex: 0.6,
    justifyContent: 'center'
   }
});
