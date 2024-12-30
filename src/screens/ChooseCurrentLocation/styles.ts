import { StyleSheet } from 'react-native';
import Theme from '../../utils/Theme';

export default StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column'
  },
  scrollView: {
    backgroundColor: '#fff',
    borderRadius: Theme.roundness,
    marginVertical: 8,
    marginHorizontal: 8
  },
  iconContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Theme.colors.backdrop,
    marginRight: 8
  }
});
