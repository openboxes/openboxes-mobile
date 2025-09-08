import { StyleSheet } from 'react-native';
import Theme from '../../utils/Theme';

export default StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10
  },
  locationText: {
    color: Theme.colors.surface,
    marginRight: 15,
    fontSize: 12,
    fontWeight: 'bold',
    flexShrink: 1
  }
});