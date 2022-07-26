import { StyleSheet } from 'react-native';
import Theme from '../../utils/Theme';

export default StyleSheet.create({
  list: {
    width: '100%'
  },
  listItemContainer: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    borderRadius: Theme.roundness,
    borderColor: Theme.colors.backdrop,
    borderWidth: 1,
    margin: 0,
    padding: 0,
    marginTop: 5
  },
  row: {
    flexDirection: 'row',
    borderColor: Theme.colors.background,
    marginTop: 1,
    padding: 2,
    width: '100%'
  },
  col100: {
    display: 'flex',
    flexDirection: 'column',
    flex: 0,
    marginStart: 4,
    width: '95%'
  },
  label: {
    fontSize: 12,
    color: Theme.colors.placeholder
  },
  arrowDownIcon: {
    height: 15,
    width: 15
  },
  select: {
    width: '100%',
    borderWidth: 1,
    height: 40,
    alignSelf: 'center',
    borderColor: 'grey',
    backgroundColor: 'white',
    borderRadius: 5,
    marginTop: 10
  }
});
