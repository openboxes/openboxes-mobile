import { StyleSheet } from 'react-native';
import Theme from '../../utils/Theme';

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
    end: Theme.spacing.medium,
    width: 30,
    height: 30,
    bottom: 12,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100
  }
});
