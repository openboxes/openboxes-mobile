import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  autoCompleteView: {
    flex: 1,
    width: '100%',
    position: 'absolute',
    marginTop: 55,
    zIndex: 10,
    backgroundColor: 'white',
    flexDirection: 'column',
    borderColor: 'grey'
  },
  input: {
    flex: 1,
    marginTop: 5,
    height: 40,
    borderColor: 'grey'
  },
  menuItem: {
    flex: 0,
    width: '100%'
  },
  container: {
    flex: 1
  },
  imageIcon: {
    position: 'absolute',
    end: 10,
    width: 30,
    height: 30,
    bottom: -7,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100
  }
});
