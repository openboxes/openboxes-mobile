import { StyleSheet } from 'react-native';
import { ratio } from '../../constants';
import Theme from '../../utils/Theme';

export default StyleSheet.create({
  contentContainer: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column'
  },
  bottom: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    height: ratio.height * 100
  },
  list: {
    width: '100%'
  },
  listItemContainer: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    borderRadius: Theme.roundness,
    borderColor: Theme.colors.backdrop,
    borderWidth: 1,
    margin: 0,
    padding: 0,
    marginTop: 5
  },
  listItemNameContainer: {
    display: 'flex',
    flexDirection: 'column',
    flex: 0,
    marginStart: 4
  },
  listItemNameLabel: {
    fontSize: 12,
    color: Theme.colors.placeholder
  },
  listItemName: {
    fontSize: 16,
    color: Theme.colors.text
  },
  listItemCategoryContainer: {
    display: 'flex',
    flexDirection: 'column',
    flex: 0,
    marginStart: 4,
    marginTop: 4
  },
  listItemCategoryLabel: {
    fontSize: 12,
    color: Theme.colors.placeholder
  },
  listItemCategory: {
    fontSize: 16,
    color: Theme.colors.text
  },
  row: {
    flexDirection: 'row',
    borderColor: Theme.colors.background,
    // borderBottomWidth: 1,
    marginTop: 1,
    padding: 2,
    width: '100%'
  },
  col50: {
    display: 'flex',
    flexDirection: 'column',
    flex: 0,
    marginStart: 4,
    width: '50%'
  },
  col100: {
    display: 'flex',
    flexDirection: 'column',
    flex: 0,
    marginStart: 4,
    width: '95%'
  },
  label: {
    fontSize: 12,
    color: Theme.colors.placeholder
  },
  value: {
    fontSize: 16,
    color: Theme.colors.text
  },
  arrowDownIcon: {
    height: 12,
    width: 12,
    marginRight: Theme.spacing.medium
  },
  select: {
    width: '100%',
    borderWidth: 1,
    height: 55,
    alignSelf: 'center',
    borderColor: 'grey',
    backgroundColor: 'white',
    borderRadius: Theme.roundness,
    marginTop: 10
  },
  lpnDetailsContainer: {
    padding: Theme.spacing.large,
    backgroundColor: Theme.colors.surface
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Theme.spacing.small / 2
  },
  chipDefault: {
    height: 24,
    justifyContent: 'center',
    borderRadius: 4,
    alignItems: 'center',
    marginRight: 8,
    backgroundColor: Theme.colors.background
  },
  chipText: {
    fontSize: 12,
    color: Theme.colors.text
  },
  contentDivider: {
    marginVertical: Theme.spacing.small
  },
  caption: { fontSize: 12, color: Theme.colors.text },
  subheading: { fontWeight: 'bold', fontSize: 16 },
  additionalInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: Theme.spacing.small,
    alignItems: 'center',
    flexWrap: 'wrap',
    marginBottom: Theme.spacing.large
  },
  containerDetails: {
    padding: Theme.spacing.large
  }
});
