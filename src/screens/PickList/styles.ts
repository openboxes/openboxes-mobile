import {StyleSheet} from 'react-native';
import Theme from '../../utils/Theme';

export default StyleSheet.create({
  screenContainer: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
  },
  contentContainer: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    padding: 8,
  },
  name: {
    fontSize: 17,
    color: Theme.colors.text,
    fontWeight: 'bold',
  },
  row: {
    flexDirection: 'row',
    borderColor: Theme.colors.background,
    // borderBottomWidth: 1,
    marginTop: 1,
    padding: 2,
    width: '100%',
  },
  col50: {
    display: 'flex',
    flexDirection: 'column',
    flex: 0,
    marginStart: 4,
    width: '50%',
  },
  label: {
    fontSize: 12,
    color: Theme.colors.placeholder,
  },
  value: {
    fontSize: 16,
    color: Theme.colors.text,
  },
  textInput: {
    fontSize: 16,
    color: Theme.colors.text,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: '#e7edd8',
  },
});
