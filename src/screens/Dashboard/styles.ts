import { StyleSheet } from 'react-native';
import Theme from '../../utils/Theme';

export default StyleSheet.create({
  screenContainer: {
    flex: 1
  },
  emptyScreenContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Theme.spacing.large
  },
  emptyScreenTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: Theme.spacing.medium,
    color: Theme.colors.primary
  },
  emptyScreenDescription: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: Theme.spacing.small,
    color: Theme.colors.placeholder
  },
  emptyScreenButton: {
    marginTop: Theme.spacing.large
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
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Theme.spacing.small
  },
  toggleTextContainer: {
    flex: 1,
    marginRight: Theme.spacing.large
  },
  lastChild: {
    marginBottom: Theme.spacing.large
  },
  card: {
    margin: Theme.spacing.small,
    elevation: Theme.spacing.small / 2
  },
  resetButton: {
    marginRight: Theme.spacing.small
  },
  groupSection: {
    marginBottom: Theme.spacing.medium
  },
  groupHeader: {
    fontSize: 16,
    fontWeight: '700',
    color: Theme.colors.disabled,
    paddingHorizontal: Theme.spacing.small,
    paddingTop: Theme.spacing.small
  }
});
