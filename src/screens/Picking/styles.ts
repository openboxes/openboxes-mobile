import { StyleSheet } from 'react-native';
import Theme from '../../utils/Theme';

export default StyleSheet.create({
  mainWrapper: {
    flex: 1,
    backgroundColor: Theme.colors.background
  },
  wrapperWithPadding: {
    padding: Theme.spacing.medium
  },
  typeListContent: {
    paddingBottom: Theme.spacing.medium
  },
  cardWrapper: {
    flex: 1,
    paddingHorizontal: Theme.spacing.medium,
    marginBottom: Theme.spacing.small / 2
  },
  typeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Theme.spacing.small,
    borderRadius: Theme.roundness,
    backgroundColor: Theme.colors.surface,
    elevation: 2
  },
  selectedCard: {
    borderColor: Theme.colors.primary,
    borderWidth: 2
  },
  contentWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center'
  },
  cardLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: Theme.colors.text
  },
  priorityBadge: {
    marginLeft: Theme.spacing.small,
    backgroundColor: Theme.colors.primary,
    alignSelf: 'center',
    paddingHorizontal: Theme.spacing.medium,
    fontSize: 14
  },
  formWrapper: {
    paddingHorizontal: Theme.spacing.medium
  },
  marginTop: {
    marginTop: Theme.spacing.medium
  },
  marginBottom: {
    marginBottom: Theme.spacing.medium
  },
  marginTopSmall: {
    marginTop: Theme.spacing.small
  },
  productDetails: {
    backgroundColor: Theme.colors.surface,
    padding: Theme.spacing.large,
    display: 'flex',
    flexDirection: 'column'
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
  title: {
    fontSize: 18,
    color: Theme.colors.text,
    fontWeight: 'bold'
  },
  divider: {
    marginVertical: Theme.spacing.small
  },
  fontBold: {
    fontWeight: 'bold'
  },
  subheading: {
    fontSize: 16,
    color: Theme.colors.text,
    fontWeight: 'bold'
  },
  caption: { fontSize: 12 },
  paragraph: {
    fontSize: 14,
    color: Theme.colors.text,
    fontWeight: 'normal'
  }
});
