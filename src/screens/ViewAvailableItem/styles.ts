import { StyleSheet } from 'react-native';
import Theme from '../../utils/Theme';

export default StyleSheet.create({
  screenContainer: {
    flex: 1
  },
  productDetails: {
    backgroundColor: Theme.colors.surface,
    padding: Theme.spacing.large
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  productImage: {
    width: 36,
    height: 36,
    resizeMode: 'contain'
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
  bold: { fontWeight: 'bold' },
  spacer: { flex: 1 },
  bottom: {
    width: '100%',
    backgroundColor: Theme.colors.surface,
    paddingVertical: Theme.spacing.small,
    paddingHorizontal: Theme.spacing.large
  },
  buttonSpacing: {
    marginBottom: Theme.spacing.small
  }
});
