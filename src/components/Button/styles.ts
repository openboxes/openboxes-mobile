import { StyleSheet } from 'react-native';
import Theme from '../../utils/Theme';

export default StyleSheet.create({
  label: {
    fontSize: 15,
    fontWeight: '600'
  },
  button: {
    alignSelf: 'center',
    justifyContent: 'center',
    display: 'flex',
    flexDirection: 'column',
    borderRadius: Theme.roundness
  },
  buttonContent: {
    height: 48
  },
  disabled: {
    backgroundColor: Theme.colors.disabled
  },
  size100: {
    width: '100%'
  },
  size80: {
    width: '80%'
  },
  size50: {
    width: '50%'
  }
});
