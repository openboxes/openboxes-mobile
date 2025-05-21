import { StyleSheet } from 'react-native';
import Theme from '../../utils/Theme';

export default StyleSheet.create({
  screenContainer: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1
  },
  contentContainer: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    padding: 10,
    backgroundColor: Theme.colors.surface
  },
  buttonBar: {
    padding: 8,
    borderTopWidth: 1,
    borderTopColor: Theme.colors.backdrop,
    backgroundColor: Theme.colors.surface
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8
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
    marginVertical: 8
  },
  destinationSubheading: {
    fontWeight: 'bold',
    fontSize: 16,
    marginVertical: 8,
    color: Theme.colors.text
  },
  additionalInfoRow: {
    flexDirection: 'row',
    marginTop: 8,
    marginBottom: 8,
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
    flexDirection: 'column',
    width: '48%',
    paddingHorizontal: 2
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
    marginHorizontal: 8,
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
    paddingHorizontal: 10,
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: Theme.colors.divider,
    backgroundColor: Theme.colors.background
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
  }
});
