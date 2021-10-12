import {StyleSheet} from 'react-native';
import Theme from '../../utils/Theme';

export default StyleSheet.create({
  screenContainer: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
  },
  countContainer: {
    display: 'flex',
    flexDirection: 'column',
    flex: 0,
    borderColor: Theme.colors.backdrop,
    borderWidth: 1,
    margin: 4,
    borderRadius: 4,
    padding: 8,
  },
  countLabelAndIconContainer: {
    display: 'flex',
    flexDirection: 'row',
    flex: 0,
    alignItems: 'center',
  },
  countLabel: {
    fontWeight: 'bold',
    fontSize: 16,
    marginStart: 4,
  },
});
