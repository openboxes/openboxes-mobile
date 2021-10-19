import {StyleSheet} from 'react-native';
import Theme from '../../utils/Theme';

export default StyleSheet.create({
  screenContainer: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
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
