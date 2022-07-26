import { StyleSheet } from 'react-native';
import { colors } from '../../assets/styles';

export default StyleSheet.create({
  label: {
    color: colors.white,
    fontSize: 15,
    fontWeight: '600'
  },
  button: {
    height: 45,
    marginTop: 25,
    backgroundColor: colors.accent,
    alignSelf: 'center',
    justifyContent: 'center',
    display: 'flex',
    flexDirection: 'column'
  },
  disabled: {
    backgroundColor: colors.lightGray
  },
  size80: {
    width: '80%'
  },
  size50: {
    width: '50%'
  }
});
