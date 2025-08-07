import { StyleSheet } from 'react-native';
import Theme from '../../utils/Theme';

export default StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: Theme.spacing.large,
    justifyContent: 'flex-start'
  },
  input: {
    marginTop: Theme.spacing.small
  }
});
