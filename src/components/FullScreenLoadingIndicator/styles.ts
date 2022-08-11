import { StyleSheet } from 'react-native';
import { colors } from '../../assets/styles';

export default StyleSheet.create({
  modalParent: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0
  },
  modalChild: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: `${colors.black}99`
  },
  progressContainer: {
    flex: 0,
    backgroundColor: colors.white,
    shadowColor: colors.black,
    padding: 20,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center'
  },
  progressMessage: {
    marginTop: 20,
    fontSize: 16
  }
});
