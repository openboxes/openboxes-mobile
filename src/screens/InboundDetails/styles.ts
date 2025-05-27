import { StyleSheet } from 'react-native';
import Theme from '../../utils/Theme';

export default StyleSheet.create({
  itemView: {
    marginStart: 10,
    marginEnd: 10,
    marginTop: 5
  },
  rowItem: {
    flexDirection: 'row',
    borderColor: Theme.colors.background,
    marginTop: 4,
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
  },
  value: {
    fontSize: 12,
    color: Theme.colors.text
  },
  headerTitle: {
    fontWeight: 'bold',
    backgroundColor: 'white',
    margin: 10,
    padding: 5,
    fontSize: 16,
    borderRadius: 10,
    elevation: 8
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
  dividerVertical: {
    width: 1,
    marginHorizontal: 8,
    height: '50%'
  },
  dividerHorizontal: {
    marginVertical: 8,
    height: 1
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
  additionalInfoRow: {
    flexDirection: 'row',
    marginTop: 8
  },
  lastChild: {
    marginRight: 0
  }
});
