import { StyleSheet } from 'react-native';
import Theme from '../../utils/Theme';
import { ratio } from '../../constants';

export default StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1
  },
  from: {
    flex: 1
  },
  rowItem: {
    flexDirection: 'row',
    borderColor: Theme.colors.background,
    marginTop: 1,
    padding: 2,
    marginStart: 4,
    width: '100%',
    alignItems: 'center'
  },
  columnItem: {
    display: 'flex',
    flexDirection: 'column',
    flex: 0,
    width: '50%'
  },
  button: {
    flexDirection: 'row',
    width: '63%',
    height: ratio.height * 100
  }
});
