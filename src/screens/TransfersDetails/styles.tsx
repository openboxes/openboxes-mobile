import { StyleSheet } from 'react-native';
import Theme from '../../utils/Theme';

export default StyleSheet.create({
  screenContainer: {
    flex: 1
  },
  contentContainer: {
    flex: 1
  },
  detailsContainer: {
    backgroundColor: Theme.colors.surface,
    padding: Theme.spacing.large
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  chipDefault: {
    height: 28,
    justifyContent: 'flex-start',
    borderRadius: 4,
    alignItems: 'center'
  },
  chipText: {
    fontSize: 12,
    color: Theme.colors.text
  },
  contentDivider: {
    marginVertical: 8
  },
  title: {
    fontSize: 16,
    color: Theme.colors.text,
    fontWeight: '600'
  },
  card: {
    marginTop: Theme.spacing.small,
    marginHorizontal: Theme.spacing.large,
    borderRadius: 8,
    borderColor: Theme.colors.disabled,
    borderWidth: 0.5
  },
  cardContent: {
    paddingVertical: Theme.spacing.medium,
    paddingHorizontal: Theme.spacing.large
  },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start'
  },
  cardProductInfo: {
    flex: 1,
    marginRight: Theme.spacing.medium
  },
  cardProductCode: {
    fontSize: 12,
    fontWeight: 'bold',
    color: Theme.colors.primary
  },
  cardProductName: {
    fontSize: 14,
    color: Theme.colors.text,
    marginTop: 2
  },
  cardQuantityBlock: {
    alignItems: 'center',
    minWidth: 50
  },
  cardQuantityValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Theme.colors.text
  },
  cardQuantityLabel: {
    fontSize: 9,
    fontWeight: '600',
    color: Theme.colors.placeholder,
    letterSpacing: 1,
    marginTop: 2
  },
  cardOnHand: {
    fontSize: 10,
    color: Theme.colors.disabled,
    marginTop: 2
  },
  cardOnHandValue: {
    fontSize: 10,
    fontWeight: '600',
    color: Theme.colors.disabled
  },
  binFlow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Theme.spacing.small,
    backgroundColor: '#F5F6F8',
    borderRadius: 6,
    padding: Theme.spacing.small
  },
  binBlock: {
    flex: 1,
    alignItems: 'center'
  },
  binLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: Theme.colors.placeholder,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    textAlign: 'center'
  },
  binValue: {
    fontSize: 13,
    fontWeight: 'bold',
    color: Theme.colors.text,
    marginTop: 2,
    textAlign: 'center'
  },
  bottom: {
    width: '100%',
    backgroundColor: Theme.colors.surface,
    paddingVertical: Theme.spacing.small,
    paddingHorizontal: Theme.spacing.large
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Theme.spacing.large * 2
  },
  listSectionLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: Theme.colors.text,
    marginTop: Theme.spacing.medium,
    marginHorizontal: Theme.spacing.large
  },
  itemListContainer: {
    paddingBottom: Theme.spacing.small
  }
});
