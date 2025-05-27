import { StyleSheet } from 'react-native';
import Theme from '../../utils/Theme';

export default StyleSheet.create({
  screenContainer: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    zIndex: -1
  },
  contentContainer: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    padding: 8
  },
  listItemContainer: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    borderRadius: Theme.roundness,
    borderColor: Theme.colors.backdrop,
    borderWidth: 1,
    margin: 4,
    padding: 4,
    justifyContent: 'center'
  },
  list: {
    width: '100%'
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%'
  },
  chipDefault: {
    height: 28,
    justifyContent: 'center',
    borderRadius: Theme.spacing.small,
    alignItems: 'center',
    marginRight: Theme.spacing.small,
    backgroundColor: Theme.colors.background
  },
  chipText: {
    fontSize: 12,
    color: Theme.colors.text
  },
  additionalInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    alignItems: 'center',
    flexWrap: 'wrap'
  },
  caption: { fontSize: 12, color: Theme.colors.text },
  subheading: { fontWeight: 'bold', fontSize: 16 }
});
