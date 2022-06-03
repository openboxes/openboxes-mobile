import { StyleSheet } from 'react-native';
import Theme from '../../utils/Theme';

export default StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1
  },
  label: {
    fontSize: 11,
    color: Theme.colors.placeholder
  },
  data: {
    fontSize: 12,
    color: Theme.colors.text,
    width: '90%'
  }
});
