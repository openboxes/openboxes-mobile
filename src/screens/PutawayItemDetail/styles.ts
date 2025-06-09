import { StyleSheet } from 'react-native';
import Theme from '../../utils/Theme';

export default StyleSheet.create({
  contentContainer: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    padding: 16
  },
  dataContainer: {
    padding: 16,
    backgroundColor: Theme.colors.surface
  },
  from: {
    flex: 1
  },
  label: {
    fontSize: 12,
    color: Theme.colors.placeholder
  },
  title: {
    fontSize: 16,
    color: Theme.colors.text,
    fontWeight: 'bold'
  },
  value: {
    fontSize: 14,
    color: Theme.colors.text
  },
  rowItem: {
    flexDirection: 'row',
    borderColor: Theme.colors.background,
    marginTop: 8,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  columnItem: {
    display: 'flex',
    flexDirection: 'column',
    flex: 0
  },
  buttonContainer: {
    marginTop: 8
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  chipDefault: {
    height: 24,
    justifyContent: 'center',
    borderRadius: 4,
    alignItems: 'center'
  },
  chipWarningText: {
    fontSize: 12,
    color: Theme.colors.text
  },
  lastChild: {
    marginRight: 0
  },
  dividerHorizontal: {
    marginVertical: 12,
    height: 1
  },
  additionalInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  scanPutawayLabel: {
    fontSize: 14,
    color: Theme.colors.placeholder,
    marginBottom: 10
  }
});
