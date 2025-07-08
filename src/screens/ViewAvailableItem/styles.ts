import { StyleSheet } from 'react-native';
import { ratio } from '../../constants';
import Theme from '../../utils/Theme';

export default StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1
  },
  rowItem: {
    flexDirection: 'row',
    borderColor: Theme.colors.background,
    marginTop: 1,
    padding: 2,
    marginStart: 4,
    width: '100%',
    alignItems: 'center'
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%'
  },
  columnItem: {
    display: 'flex',
    flexDirection: 'column',
    flex: 0,
    width: '50%'
  },
  buttons: {
    flexDirection: 'column',
    marginVertical: Theme.spacing.large,
    justifyContent: 'space-between',
    height: ratio.height * 100
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
  }
});
