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
  bold: { fontWeight: 'bold' },
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
  }
});
