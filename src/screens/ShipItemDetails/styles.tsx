import { StyleSheet } from 'react-native';
import Theme from '../../utils/Theme';

export default StyleSheet.create({
  label: {
    fontSize: 12,
    color: Theme.colors.placeholder,
    alignSelf: 'flex-start'
  },
  textContainer: {
    flexDirection: 'column',
    borderColor: Theme.colors.background,
    marginTop: 1,
    padding: 2,
    width: '100%',
    alignItems: 'center'
  },
  alignCenterContent: {
    alignItems: 'center'
  }
});
