import { StyleSheet } from 'react-native';
import Theme from '../../utils/Theme';

export default StyleSheet.create({
  screenContainer: {
    flex: 1
  },
  content: {
    flex: 1
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  scrollView: {
    borderRadius: Theme.roundness,
    margin: Theme.spacing.small
  },
  cardContainer: {
    marginHorizontal: Theme.spacing.small / 4,
    marginVertical: Theme.spacing.small
  },
  cardContent: {
    flexDirection: 'row'
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    padding: Theme.spacing.medium
  },
  textContainer: {
    marginLeft: Theme.spacing.large,
    justifyContent: 'center',
    alignItems: 'flex-start',
    flex: 1
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Theme.colors.primary
  },
  cardSubtitle: {
    fontSize: 12,
    color: Theme.colors.backdrop,
    fontWeight: '400'
  },
  selectedCard: {
    borderColor: Theme.colors.primary,
    borderWidth: 5
  },
  selectedItem: {
    backgroundColor: '#e0e0e0',
    borderRadius: Theme.roundness
  }
});
