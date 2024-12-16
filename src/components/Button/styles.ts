import { StyleSheet } from 'react-native';
import Theme from '../../utils/Theme';

export default StyleSheet.create({
  label: {
    fontSize: 15,
    fontWeight: '600'
  },
  button: {
    height: 45,
    alignSelf: 'center',
    justifyContent: 'center',
    display: 'flex',
    flexDirection: 'column',
    borderRadius: 16
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
