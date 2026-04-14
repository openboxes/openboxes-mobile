import { StyleSheet } from 'react-native';
import Theme from '../../utils/Theme';

export default StyleSheet.create({
  screenContainer: {
    flex: 1
  },
  contentContainer: {
    flex: 1
  },
  productDetails: {
    backgroundColor: Theme.colors.surface,
    padding: Theme.spacing.large
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
  chipSpacing: {
    marginTop: Theme.spacing.small
  },
  contentDivider: {
    marginVertical: 8
  },
  title: {
    fontSize: 18,
    color: Theme.colors.text,
    fontWeight: '600'
  },
  titleParent: {
    fontSize: 14,
    fontWeight: 'normal',
    color: Theme.colors.placeholder
  },
  subtitle: {
    marginTop: -4
  },
  bold: { fontWeight: 'bold' },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Theme.colors.text,
    marginBottom: 4
  },
  formContainer: {
    padding: Theme.spacing.large
  },
  fieldGap: {
    marginTop: Theme.spacing.medium
  },
  bottom: {
    width: '100%',
    backgroundColor: Theme.colors.surface,
    paddingVertical: Theme.spacing.small,
    paddingHorizontal: Theme.spacing.large
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
});
