import { StyleSheet } from 'react-native';
import Theme from '../../utils/Theme';

export default StyleSheet.create({
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
  pressableChipText: {
    paddingRight: 24
  },
  chipText: {
    fontSize: 12,
    color: Theme.colors.text
  },
  itemChevron: {
    position: 'absolute',
    right: Theme.spacing.small,
    top: 12,
    color: Theme.colors.secondaryForeground
  },
  fontBold: {
    fontWeight: 'bold'
  },
  secondaryValue: {
    color: Theme.colors.secondaryForeground
  },
  title: {
    fontSize: 18,
    color: Theme.colors.text,
    fontWeight: 'bold'
  },
  divider: {
    marginVertical: Theme.spacing.small
  },
  marginTopSmall: {
    marginTop: Theme.spacing.small
  }
});
