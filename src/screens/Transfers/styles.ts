import {StyleSheet} from 'react-native';
import Theme from '../../utils/Theme';

export default StyleSheet.create({
  screenContainer: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    zIndex: -1,
  },
  contentContainer: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    padding: 8,
  },
  listItemContainer: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    borderRadius: Theme.roundness,
    borderColor: Theme.colors.backdrop,
    borderWidth: 1,
    margin: 4,
    padding: 4,
    justifyContent: 'center',
  },
  list: {
    width: '100%',
  },
  row: {
    flexDirection: 'row',
    borderColor: Theme.colors.onBackground,
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
    fontSize: 14,
    marginTop: 5,
    color: Theme.colors.text,
  },
});
