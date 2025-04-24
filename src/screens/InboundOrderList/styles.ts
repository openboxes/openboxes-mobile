import { StyleSheet } from 'react-native';
import Theme from '../../utils/Theme';

export default StyleSheet.create({
  container: {
    flex: 1,
    zIndex: -1
  },
  chipWarning: {
    height: 24,
    justifyContent: 'center',
    borderRadius: 4,
    alignItems: 'center',
    backgroundColor: Theme.colors.warning
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
    marginRight: 8
  },
  chipDefaultText: {
    fontSize: 12,
    color: Theme.colors.text
  },
  dividerHorizontal: {
    marginVertical: 8
  },
  dividerVertical: {
    width: 1,
    marginHorizontal: 8,
    height: '50%'
  },
  additionalInfoRow: {
    flexDirection: 'row',
    marginTop: 8
  },
  rowItem: {
    flexDirection: 'row',
    borderColor: Theme.colors.background,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  columnItem: {
    flexDirection: 'column',
    flex: 0
  },
  label: {
    fontSize: 10,
    color: Theme.colors.placeholder
  },
  value: {
    fontSize: 12,
    color: Theme.colors.text
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  dividedValues: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  }
});
