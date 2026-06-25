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
    flexDirection: 'column'
  },
  list: {
    width: '100%'
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  dividedValues: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  value: {
    fontSize: 12,
    color: Theme.colors.text
  },
  chipWarning: {
    height: 24,
    justifyContent: 'center',
    borderRadius: 4,
    alignItems: 'center',
    backgroundColor: Theme.colors.warningBackground
  },
  chipWarningText: {
    fontSize: 12,
    color: Theme.colors.text
  },
  dividerHorizontal: {
    marginVertical: 8
  },
  subheading: {
    fontWeight: 'bold'
  },
  additionalInfoRow: {
    flexDirection: 'row',
    marginTop: 8
  },
  chipDefault: {
    height: 24,
    justifyContent: 'center',
    borderRadius: 4,
    alignItems: 'center',
    marginRight: 8
  },
  chipDefaultText: {
    fontSize: 12,
    color: Theme.colors.text
  },
  rowItem: {
    flexDirection: 'row',
    borderColor: Theme.colors.background,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  columnItem: {
    display: 'flex',
    flexDirection: 'column',
    flex: 0,
    justifyContent: 'space-between'
  },
  label: {
    fontSize: 10,
    color: Theme.colors.placeholder
  }
});
