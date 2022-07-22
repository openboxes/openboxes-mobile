import { StyleSheet } from 'react-native';
import Theme from '../../utils/Theme';

export default StyleSheet.create({
  screenContainer: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    zIndex: -1
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  label: {
    fontSize: 12,
    color: Theme.colors.placeholder,
    marginHorizontal: 5,
    marginVertical: 2
  },
  list: {
    width: '100%'
  }
});
