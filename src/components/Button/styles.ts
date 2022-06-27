import { StyleSheet } from 'react-native';
import { colors } from '../../constants';

export default StyleSheet.create({
  label: {
    color: 'white',
    fontSize: 15,
    fontWeight: '600'
  },
  button: {
    height: 45,
    marginTop: 25,
    backgroundColor: colors.headerColor,
    alignSelf: 'center',
    justifyContent: 'center',
    display: 'flex',
    flexDirection: 'column'
  },
  disabled: {
    backgroundColor: colors.disabledBgColor
  },
  size80: {
    width: '80%'
  },
  size50: {
    width: '50%'
  }
});
