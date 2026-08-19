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
  chipStacked: {
    height: 44,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 4,
    borderRadius: 4,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#ebebeb',
    backgroundColor: '#ebebeb'
  },
  chipStackedIcon: {
    padding: 4,
    color: '#6c6c6c'
  },
  chipStackedText: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginLeft: 4,
    marginRight: Theme.spacing.small
  },
  chipStackedFirstLine: {
    lineHeight: 16
  },
  chipStackedValue: {
    flex: 1
  },
  chipSecondaryLine: {
    fontSize: 11,
    lineHeight: 15,
    color: Theme.colors.secondaryForeground
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
  chipStackedChevron: {
    alignSelf: 'center',
    color: Theme.colors.secondaryForeground
  },
  fontBold: {
    fontWeight: 'bold'
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
