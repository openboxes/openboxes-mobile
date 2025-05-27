import { StyleSheet } from 'react-native';
import Theme from '../../utils/Theme';

export default StyleSheet.create({
  screenContainer: {
    flex: 1
  },
  flatListContentContainer: {
    padding: Theme.spacing.small / 2
  },
  cardContainer: {
    flex: 1,
    margin: Theme.spacing.small / 2
  },
  cardContent: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: Theme.spacing.medium,
    flexGrow: 1
  },
  iconWrapper: {
    marginBottom: Theme.spacing.small
  },
  icon: {
    width: 48,
    height: 48
  },
  cardLabel: {
    color: Theme.colors.primary,
    fontWeight: '600'
  }
});
