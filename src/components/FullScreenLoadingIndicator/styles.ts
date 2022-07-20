import { StyleSheet } from 'react-native';

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
    backgroundColor: '#00000099'
  },
  progressContainer: {
    flex: 0,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000000',
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
