import { StyleSheet } from 'react-native';
import Theme from '../../utils/Theme';

export default StyleSheet.create({
  contentContainer: {
    display: 'flex',
    flexDirection: 'column',
    padding: Theme.spacing.medium
  },
  formContainer: {
    padding: Theme.spacing.medium,
    flex: 1
  },
  buttonBar: {
    paddingHorizontal: Theme.spacing.large,
    paddingVertical: Theme.spacing.small,
    borderTopColor: Theme.colors.backdrop,
    backgroundColor: Theme.colors.surface
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Theme.spacing.small / 2
  },
  dividedValues: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  identifierContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 1
  },
  contentDivider: {
    marginVertical: Theme.spacing.small / 2
  },
  destinationSubheading: {
    fontWeight: 'bold',
    fontSize: 16,
    marginVertical: Theme.spacing.small / 2,
    color: Theme.colors.text
  },
  additionalInfoRow: {
    flexDirection: 'row',
    marginTop: Theme.spacing.small / 2,
    marginBottom: Theme.spacing.small / 2,
    alignItems: 'center'
  },
  chipWarning: {
    height: 24,
    justifyContent: 'center',
    borderRadius: 4,
    alignItems: 'center',
    backgroundColor: Theme.colors.warning,
    paddingHorizontal: 8
  },
  chipWarningText: {
    fontSize: 12,
    color: Theme.colors.text
  },
  chipDefault: {
    height: 24,
    justifyContent: 'center',
    borderRadius: 4,
    alignItems: 'center',
    marginRight: 8,
    paddingHorizontal: 8
  },
  chipDefaultText: {
    fontSize: 12,
    color: Theme.colors.text
  },
  rowItem: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginVertical: 6
  },
  columnItem: {
    display: 'flex',
    flexDirection: 'column'
  },
  label: {
    fontSize: 10,
    color: Theme.colors.placeholder
  },
  value: {
    fontSize: 12,
    color: Theme.colors.text,
    flexShrink: 1
  },
  scanSearch: {
    marginVertical: 12,
    backgroundColor: Theme.colors.surface
  },
  itemView: {
    marginHorizontal: 5,
    marginTop: 5,
    marginBottom: 10
  },
  headerContainer: {
    flexDirection: 'row',
    marginHorizontal: 5,
    marginTop: 10,
    marginBottom: 5,
    paddingVertical: 10,
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  headerTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    flex: 1,
    color: Theme.colors.text
  },
  infoButton: {
    width: 30,
    height: 30,
    marginLeft: 10,
    alignItems: 'center',
    justifyContent: 'center'
  },
  loadButton: {
    marginTop: 10
  },
  caption: { fontSize: 12, color: Theme.colors.text },
  subheading: { fontWeight: 'bold', fontSize: 16 },
  cardContainer: { backgroundColor: Theme.colors.background },
  lastChild: {
    marginRight: 0
  },
  dividerHorizontal: {
    marginVertical: Theme.spacing.small
  },
  flex1: {
    flex: 1
  }
});
